import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './ControlAsistenciaDocenteView.css';

import { API_BASE_URL } from "../../config.jsx";

const ESTADOS_UI = {
    PRESENTE: 'Presente',
    AUSENTE: 'Ausente',
    TARDE: 'Tarde',
    JUSTIFICADO: 'Justificado',
    SIN_REGISTRAR: 'SIN_REGISTRAR',
};

const ESTADOS_API = {
    Presente: 'PRESENTE',
    Ausente: 'AUSENTE',
    Tarde: 'TARDE',
    Justificado: 'JUSTIFICADO',
};

function obtenerFechaLocal() {
    const ahora = new Date();
    const desplazamiento = ahora.getTimezoneOffset() * 60000;
    return new Date(ahora.getTime() - desplazamiento).toISOString().slice(0, 10);
}

function obtenerToken() {
    return localStorage.getItem('jwt_token');
}

export default function ControlAsistenciaDocenteView({ onVolver }) {
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [grado, setGrado] = useState('');
    const [seccion, setSeccion] = useState('');
    const [gradoId, setGradoId] = useState(null);
    const [seccionId, setSeccionId] = useState(null);
    const [fecha, setFecha] = useState(obtenerFechaLocal());
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarAsistencia = useCallback(async () => {
        setCargando(true);
        setError('');
        setMensaje('');

        try {
            const token = obtenerToken();
            if (!token) {
                throw new Error('No se encontró el token de sesión. Inicia sesión nuevamente.');
            }

            const respuesta = await fetch(
                `${API_BASE_URL}/api/asistencias/lista/${encodeURIComponent(fecha)}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            if (!respuesta.ok) {
                if (respuesta.status === 401) throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
                if (respuesta.status === 403) throw new Error('No tienes permiso para consultar esta asistencia.');
                const detalle = await respuesta.text();
                throw new Error(detalle || `No se pudo cargar la asistencia (${respuesta.status}).`);
            }

            const datos = await respuesta.json();

            const esListaDirecta = Array.isArray(datos);
            const listaOriginal = esListaDirecta ? datos : (datos?.alumnos ?? []);

            setGrado(esListaDirecta ? '' : (datos?.grado ?? ''));
            setSeccion(esListaDirecta ? '' : (datos?.seccion ?? ''));
            setGradoId(esListaDirecta ? null : (datos?.gradoId ?? null));
            setSeccionId(esListaDirecta ? null : (datos?.seccionId ?? null));

            // Mapeo seguro con valores por defecto garantizados
            const alumnosFormateados = listaOriginal.map((item, index) => {
                const estadoApi = String(item?.estado ?? 'SIN_REGISTRAR').toUpperCase();
                const idAlumno = item?.estudianteId ?? item?.id ?? (index + 1);
                const nombreAlumno = item?.nombreEstudiante
                    || item?.nombre
                    || `${item?.estudianteNombre || ''} ${item?.estudianteApellido || ''}`.trim()
                    || `Estudiante ${idAlumno}`;

                return {
                    id: idAlumno,
                    nombre: nombreAlumno,
                    estado: ESTADOS_UI[estadoApi] || 'SIN_REGISTRAR',
                    hora: item?.hora && item?.hora !== '-' ? item.hora : '-',
                    observacion: item?.observacion ?? item?.comentario ?? '',
                    estadoOriginal: estadoApi,
                };
            });

            setAlumnos(alumnosFormateados);

        } catch (e) {
            setAlumnos([]);
            setGrado('');
            setSeccion('');
            setGradoId(null);
            setSeccionId(null);
            setError(e.message || 'Ocurrió un error al consultar la asistencia.');
        } finally {
            setCargando(false);
        }
    }, [fecha]);

    useEffect(() => {
        cargarAsistencia();
    }, [cargarAsistencia]);

    const handleEstadoChange = (id, nuevoEstado) => {
        const horaActual = new Date().toLocaleTimeString('es-GT', {
            hour: '2-digit',
            minute: '2-digit',
        });

        setAlumnos((prev) => prev.map((alumno) => {
            if (alumno.id !== id) return alumno;
            return {
                ...alumno,
                estado: nuevoEstado,
                hora: nuevoEstado === 'Ausente'
                    ? '-'
                    : (alumno.hora === '-' ? horaActual : alumno.hora),
            };
        }));
    };

    const handleObservacionChange = (id, observacion) => {
        setAlumnos((prev) => prev.map((alumno) =>
            alumno.id === id ? { ...alumno, observacion } : alumno
        ));
    };

    const alumnosFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();
        return alumnos.filter((alumno) =>
            (alumno.nombre || '').toLowerCase().includes(termino) ||
            String(alumno.id || '').includes(termino)
        );
    }, [alumnos, busqueda]);

    const totalPresentes = alumnos.filter((alumno) => alumno.estado === 'Presente').length;
    const totalAusentes = alumnos.filter((alumno) => alumno.estado === 'Ausente').length;
    const totalTarde = alumnos.filter((alumno) => alumno.estado === 'Tarde').length;
    const totalJustificados = alumnos.filter((alumno) => alumno.estado === 'Justificado').length;
    const totalSinRegistrar = alumnos.filter((alumno) => alumno.estado === 'SIN_REGISTRAR').length;

    const handleGuardar = async () => {
        setError('');
        setMensaje('');

        if (alumnos.length === 0) {
            setError('No hay alumnos para registrar.');
            return;
        }

        const pendientes = alumnos.filter((alumno) => !ESTADOS_API[alumno.estado]);
        if (pendientes.length > 0) {
            setError(`Selecciona un estado para todos los alumnos. Faltan ${pendientes.length} por registrar.`);
            return;
        }

        setGuardando(true);
        try {
            const token = obtenerToken();
            if (!token) throw new Error('No se encontró el token de sesión. Inicia sesión nuevamente.');

            const registro = {
                fecha,
                detalles: alumnos.map((alumno) => ({
                    estudianteId: alumno.id,
                    estado: ESTADOS_API[alumno.estado],
                    observacion: (alumno.observacion || '').trim(),
                })),
            };

            const respuesta = await fetch(`${API_BASE_URL}/api/asistencias/registrar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(registro),
            });

            if (!respuesta.ok) {
                const detalle = await respuesta.text();
                if (respuesta.status === 401) throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
                if (respuesta.status === 403) throw new Error('No tienes permiso para registrar asistencias.');
                throw new Error(detalle || `No se pudo guardar la asistencia (${respuesta.status}).`);
            }

            const texto = await respuesta.text();
            setMensaje(texto || 'Asistencia guardada correctamente.');
            await cargarAsistencia();
        } catch (e) {
            setError(e.message || 'Ocurrió un error al guardar la asistencia.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <main className="asistencia-page">
            <header className="asistencia-header">
                <div className="asistencia-heading">
                    <button
                        type="button"
                        className="asistencia-back"
                        onClick={onVolver}
                        aria-label="Volver"
                    >
                        ←
                    </button>
                    <div className="asistencia-heading-text">
                        <h1>Control de asistencia</h1>
                        <p>Gestiona la asistencia diaria de tus estudiantes.</p>
                    </div>
                </div>

                <label className="asistencia-date">
                    <span>Fecha de asistencia</span>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </label>
            </header>

            <section className="asistencia-summary">
                <article className="summary-card">
                    <div className="summary-icon icon-total">#</div>
                    <div className="summary-info">
                        <span>Total alumnos</span>
                        <strong>{alumnos.length}</strong>
                    </div>
                </article>
                <article className="summary-card">
                    <div className="summary-icon icon-present">✓</div>
                    <div className="summary-info">
                        <span>Presentes</span>
                        <strong>{totalPresentes}</strong>
                    </div>
                </article>
                <article className="summary-card">
                    <div className="summary-icon icon-absent">×</div>
                    <div className="summary-info">
                        <span>Ausentes</span>
                        <strong>{totalAusentes}</strong>
                    </div>
                </article>
                <article className="summary-card">
                    <div className="summary-icon icon-late">◷</div>
                    <div className="summary-info">
                        <span>Llegadas tarde</span>
                        <strong>{totalTarde}</strong>
                    </div>
                </article>
                <article className="summary-card">
                    <div className="summary-icon">✓</div>
                    <div className="summary-info">
                        <span>Justificados</span>
                        <strong>{totalJustificados}</strong>
                    </div>
                </article>
            </section>

            <section className="asistencia-panel">
                <div className="asistencia-filters">
                    <div className="filters-left">
                        <div className="filter-field">
                            <span>Grado</span>
                            <strong>{grado || '—'}</strong>
                        </div>
                        <div className="filter-field">
                            <span>Sección</span>
                            <strong>{seccion || '—'}</strong>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="asistencia-save"
                        onClick={handleGuardar}
                        disabled={cargando || guardando || alumnos.length === 0}
                    >
                        <span>✓</span>
                        {guardando ? 'Guardando...' : 'Guardar asistencias'}
                    </button>
                </div>

                {(error || mensaje) && (
                    <div role={error ? 'alert' : 'status'} className={error ? 'asistencia-error' : 'asistencia-success'}>
                        {error || mensaje}
                    </div>
                )}

                {totalSinRegistrar > 0 && !cargando && (
                    <p className="asistencia-pendientes">
                        Hay {totalSinRegistrar} alumno(s) sin registrar. Selecciona su estado antes de guardar.
                    </p>
                )}

                <div className="asistencia-toolbar">
                    <div className="toolbar-heading">
                        <h2>Lista de alumnos</h2>
                        <p>{alumnosFiltrados.length} de {alumnos.length} alumnos</p>
                    </div>
                    <label className="asistencia-search">
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            placeholder="Buscar por nombre o ID..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </label>
                </div>

                {cargando ? (
                    <p className="asistencia-loading">Cargando lista de alumnos...</p>
                ) : error && alumnos.length === 0 ? (
                    <p className="no-results">No fue posible cargar la lista.</p>
                ) : (
                    <div className="asistencia-table-scroll">
                        <table className="asistencia-table">
                            <thead>
                            <tr>
                                <th className="col-number">N.º</th>
                                <th className="col-id">ID</th>
                                <th className="col-student">Nombre del alumno</th>
                                <th className="col-status">Estado</th>
                                <th className="col-time">Hora</th>
                                <th className="col-observation">Observación</th>
                            </tr>
                            </thead>
                            <tbody>
                            {alumnosFiltrados.map((alumno, index) => {
                                const estadoClase = (alumno.estado || 'SIN_REGISTRAR').toLowerCase();
                                return (
                                    <tr key={alumno.id ?? index}>
                                        <td className="number-cell">{String(index + 1).padStart(2, '0')}</td>
                                        <td>
                                            <span className="student-id">{String(alumno.id ?? '-').padStart(2, '0')}</span>
                                        </td>
                                        <td className="student-name">{alumno.nombre || 'Sin Nombre'}</td>
                                        <td>
                                            <div className={`status-control status-${estadoClase}`}>
                                                <span className="status-dot" />
                                                <select
                                                    aria-label={`Estado de ${alumno.nombre}`}
                                                    value={alumno.estado || 'SIN_REGISTRAR'}
                                                    onChange={(e) => handleEstadoChange(alumno.id, e.target.value)}
                                                >
                                                    <option value="SIN_REGISTRAR">Sin registrar</option>
                                                    <option value="Presente">Presente</option>
                                                    <option value="Ausente">Ausente</option>
                                                    <option value="Tarde">Tarde</option>
                                                    <option value="Justificado">Justificado</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="student-time">{alumno.hora || '-'}</td>
                                        <td>
                                            <input
                                                className="observation-input"
                                                type="text"
                                                aria-label={`Observación de ${alumno.nombre}`}
                                                value={alumno.observacion || ''}
                                                onChange={(e) => handleObservacionChange(alumno.id, e.target.value)}
                                                placeholder="Escribir observación..."
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            {alumnosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="no-results">
                                        {busqueda ? 'No se encontraron alumnos con esa búsqueda.' : 'No hay alumnos para mostrar.'}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                <footer className="asistencia-footer">
                    <span>Control diario de asistencia</span>
                    <span>{fecha}</span>
                </footer>
            </section>
        </main>
    );
}