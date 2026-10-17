import React, { useMemo, useState } from 'react';
import './ReportesDocenteView.css';

import { API_BASE_URL } from "../../config.jsx";



const API_URL = `${API_BASE_URL}/api/asistencias`;;
const ESTADOS = ['PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO'];

function fechaLocal(d = new Date()) {
    const copia = new Date(d);
    copia.setMinutes(copia.getMinutes() - copia.getTimezoneOffset());
    return copia.toISOString().slice(0, 10);
}
function sumarDia(fecha, n) {
    const d = new Date(`${fecha}T12:00:00`);
    d.setDate(d.getDate() + n);
    return fechaLocal(d);
}
function leer(obj, keys, fallback = '') {
    for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
    return fallback;
}
function estadoDe(r) {
    const e = String(leer(r, ['estado', 'estadoAsistencia', 'estatus'], '')).toUpperCase();
    if (e.includes('PRESENT')) return 'PRESENTE';
    if (e.includes('AUSENT') || e.includes('FALTA')) return 'AUSENTE';
    if (e.includes('TARD')) return 'TARDE';
    if (e.includes('JUST')) return 'JUSTIFICADO';
    return e || 'SIN_DATO';
}
function normalizar(r, fecha) {
    const est = r?.estudiante ?? r?.alumno ?? {};
    return {
        // El id del DTO es el ID de la asistencia, no el del estudiante.
        asistenciaId: leer(r, ['id'], ''),
        estudianteId: leer(r, ['estudianteId', 'alumnoId', 'idEstudiante'], leer(est, ['id', 'estudianteId'], '')),
        matricula: String(leer(r, ['matricula', 'codigoEstudiante'], leer(est, ['matricula', 'codigoEstudiante'], ''))),
        nombre: String(leer(r, ['nombreEstudiante', 'nombreAlumno', 'nombreCompleto', 'nombre'], leer(est, ['nombreCompleto', 'nombre'], 'Alumno'))),
        fecha: String(leer(r, ['fecha'], fecha)).slice(0, 10),
        estado: estadoDe(r),
        hora: leer(r, ['hora'], '-'),
        observacion: leer(r, ['observacion', 'comentario'], ''),
    };
}
function escaparHTML(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function descargar(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement('a');
    a.href = url; a.download = nombre; a.click();
    URL.revokeObjectURL(url);
}

export default function ReportesDocenteView({ onVolver }) {
    const hoy = fechaLocal();
    const [desde, setDesde] = useState(`${hoy.slice(0, 8)}01`);
    const [hasta, setHasta] = useState(hoy);
    const [tabActiva, setTabActiva] = useState('Resumen');
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [generado, setGenerado] = useState(false);

    const cargarReporte = async () => {
        setError(''); setGenerado(false);
        if (!desde || !hasta || desde > hasta) {
            setError('Selecciona un rango de fechas válido.'); return;
        }
        const token = localStorage.getItem('jwt_token'); // Ajusta la clave si tu login usa otra.
        if (!token) { setError('No se encontró el token de sesión. Inicia sesión nuevamente.'); return; }

        setCargando(true);
        try {
            const fechas = [];
            for (let f = desde; f <= hasta; f = sumarDia(f, 1)) fechas.push(f);
            const todos = [];
            // Consultar en lotes para no lanzar demasiadas peticiones simultáneas.
            for (let i = 0; i < fechas.length; i += 5) {
                const lote = fechas.slice(i, i + 5);
                const datos = await Promise.all(lote.map(async fecha => {
                    const res = await fetch(`${API_URL}/lista/${fecha}`, {
                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                    });
                    if (!res.ok) {
                        if (res.status === 401) throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
                        if (res.status === 403) throw new Error('No tienes permiso para consultar estos reportes.');
                        throw new Error((await res.text()) || `Error consultando ${fecha}: ${res.status}`);
                    }
                    const json = await res.json();
                    if (!Array.isArray(json)) throw new Error('El endpoint /lista/{fecha} no devolvió una lista.');
                    return json.map(r => normalizar(r, fecha));
                }));
                todos.push(...datos.flat());
            }
            setRegistros(todos);
            setGenerado(true);
        } catch (e) {
            setRegistros([]);
            setError(e.message || 'No se pudo generar el reporte.');
        } finally { setCargando(false); }
    };

    // El DTO actual no incluye estudianteId; contamos por matrícula cuando existe.
    const alumnosUnicos = useMemo(() => new Set(registros.map(r => r.matricula).filter(Boolean)).size, [registros]);
    const conteo = estado => registros.filter(r => r.estado === estado).length;
    const presentes = conteo('PRESENTE');
    const ausentes = conteo('AUSENTE');
    const tardanzas = conteo('TARDE');
    const justificados = conteo('JUSTIFICADO');
    const total = presentes + ausentes + tardanzas + justificados;
    const pct = n => total ? `${Math.round(n * 100 / total)}%` : '0%';

    const semanas = useMemo(() => {
        const map = new Map();
        registros.forEach(r => {
            const d = new Date(`${r.fecha}T12:00:00`);
            d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
            const lunes = fechaLocal(d);
            if (!map.has(lunes)) map.set(lunes, { label: lunes, presentes: 0, ausentes: 0, tardanzas: 0, total: 0 });
            const s = map.get(lunes);
            if (r.estado === 'PRESENTE') s.presentes++;
            if (r.estado === 'AUSENTE') s.ausentes++;
            if (r.estado === 'TARDE') s.tardanzas++;
            if (ESTADOS.includes(r.estado)) s.total++;
        });
        return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
    }, [registros]);

    const filas = useMemo(() => {
        if (tabActiva === 'Tardanzas') return registros.filter(r => r.estado === 'TARDE');
        if (tabActiva === 'Ausencias') return registros.filter(r => r.estado === 'AUSENTE');
        if (tabActiva === 'Por alumno') return [...registros].sort((a, b) => a.nombre.localeCompare(b.nombre) || a.fecha.localeCompare(b.fecha));
        return [...registros].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.nombre.localeCompare(b.nombre));
    }, [registros, tabActiva]);

    const exportarExcel = () => {
        if (!generado) return setError('Primero genera el reporte.');
        const rows = [['Fecha','Matrícula','Alumno','Estado','Hora','Observación'], ...filas.map(r => [r.fecha,r.matricula,r.nombre,r.estado,r.hora,r.observacion])];
        const csv = rows.map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
        descargar(`reporte-asistencia-${desde}-${hasta}.csv`, '\uFEFF' + csv, 'text/csv;charset=utf-8;');
    };
    const exportarPDF = () => {
        if (!generado) return setError('Primero genera el reporte.');
        const w = window.open('', '_blank');
        if (!w) return setError('Permite las ventanas emergentes para exportar a PDF.');
        const trs = filas.map(r => `<tr><td>${escaparHTML(r.fecha)}</td><td>${escaparHTML(r.matricula || '-')}</td><td>${escaparHTML(r.nombre)}</td><td>${escaparHTML(r.estado)}</td><td>${escaparHTML(r.hora)}</td><td>${escaparHTML(r.observacion)}</td></tr>`).join('');
        w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Reporte de asistencia</title><style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #ccc;padding:7px;text-align:left}th{background:#eee}</style></head><body><h1>Reporte de asistencia</h1><p>Del ${escaparHTML(desde)} al ${escaparHTML(hasta)}</p><button onclick="window.print()">Imprimir / Guardar como PDF</button><table><thead><tr><th>Fecha</th><th>Matrícula</th><th>Alumno</th><th>Estado</th><th>Hora</th><th>Observación</th></tr></thead><tbody>${trs}</tbody></table></body></html>`);
        w.document.close();
    };

    return (
        <div className="reportes-content">
            <header className="reportes-header">
                <div className="title-section">
                    <button className="btn-back" onClick={onVolver} title="Volver al Inicio" type="button">←</button>
                    <h1>Reportes de Asistencia</h1>
                </div>
            </header>

            <div className="filters-card">
                <div className="filter-item"><label>Desde:</label><div className="input-with-icon">📅<input type="date" value={desde} onChange={e => setDesde(e.target.value)} /></div></div>
                <div className="filter-item"><label>Hasta:</label><div className="input-with-icon">📅<input type="date" value={hasta} onChange={e => setHasta(e.target.value)} /></div></div>
                <div className="filter-item"><label>Grado:</label><div className="reporte-seccion-fija">  </div></div>
                <div className="filter-item"><label>Sección:</label><div className="reporte-seccion-fija"> </div></div>
                <button className="btn-generar" onClick={cargarReporte} disabled={cargando} type="button">{cargando ? 'Generando...' : 'Generar'}</button>
            </div>

            {error && <p className="reporte-mensaje reporte-error" role="alert">{error}</p>}
            {generado && !error && <p className="reporte-mensaje" role="status">Reporte cargado: {desde} a {hasta}.</p>}

            <div className="tabs-and-export">
                <div className="tabs-list">
                    {['Resumen','Por alumno','Por fecha','Tardanzas','Ausencias'].map(tab => <button key={tab} type="button" className={`tab-btn ${tabActiva === tab ? 'active' : ''}`} onClick={() => setTabActiva(tab)}>{tab}</button>)}
                </div>
                <div className="export-buttons">
                    <button className="btn-export pdf" onClick={exportarPDF} type="button" disabled={!generado}>📑 Exportar PDF</button>
                    <button className="btn-export excel" onClick={exportarExcel} type="button" disabled={!generado}>📥 Exportar Excel (CSV)</button>
                </div>
            </div>

            <div className="metric-cards-grid">
                <div className="metric-card blue"><div className="icon-box">👥</div><div className="metric-info"><h2>{alumnosUnicos}</h2><p>Total de alumnos</p></div></div>
                <div className="metric-card green"><div className="icon-box">✓</div><div className="metric-info"><h2>{presentes}</h2><p>Asistencias</p></div></div>
                <div className="metric-card red"><div className="icon-box">✕</div><div className="metric-info"><h2>{ausentes}</h2><p>Ausencias</p></div></div>
                <div className="metric-card yellow"><div className="icon-box">🕒</div><div className="metric-info"><h2>{tardanzas}</h2><p>Tardanzas</p></div></div>
            </div>

            {tabActiva === 'Resumen' ? (
                <div className="charts-and-table-grid">
                    <div className="chart-card">
                        <h3>Gráfica de asistencia por semana</h3>
                        <div className="reporte-barras">
                            {!semanas.length && <p>No hay datos. Selecciona el rango y pulsa Generar.</p>}
                            {semanas.map(s => <div className="reporte-semana" key={s.label}>
                                <strong>{s.total}</strong>
                                <div className="reporte-barra" title={`Presentes ${s.presentes}, ausentes ${s.ausentes}, tardanzas ${s.tardanzas}`}>
                                    <span className="reporte-barra-presente" style={{height: `${s.total ? s.presentes/s.total*100 : 0}%`}} />
                                    <span className="reporte-barra-ausente" style={{height: `${s.total ? s.ausentes/s.total*100 : 0}%`}} />
                                    <span className="reporte-barra-tarde" style={{height: `${s.total ? s.tardanzas/s.total*100 : 0}%`}} />
                                </div><small>{s.label}</small>
                            </div>)}
                        </div>
                        <p className="reporte-leyenda">🟢 Presentes　🔴 Ausentes　🟡 Tardanzas</p>
                        <p className="reporte-nota"></p>
                    </div>
                    <div className="detail-card">
                        <h3>Detalle por estado</h3>
                        <table className="detail-table"><thead><tr><th>Estado</th><th>Cantidad</th><th>Porcentaje</th></tr></thead>
                            <tbody>
                            <tr><td>🟢 Presentes</td><td>{presentes}</td><td>{pct(presentes)}</td></tr>
                            <tr><td>🔴 Ausentes</td><td>{ausentes}</td><td>{pct(ausentes)}</td></tr>
                            <tr><td>🟡 Tardanzas</td><td>{tardanzas}</td><td>{pct(tardanzas)}</td></tr>
                            <tr><td>🔵 Justificados</td><td>{justificados}</td><td>{pct(justificados)}</td></tr>
                            <tr className="total-row"><td><strong>Total</strong></td><td><strong>{total}</strong></td><td><strong>{total ? '100%' : '0%'}</strong></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="detail-card reporte-tabla-card">
                    <h3>{tabActiva === 'Por alumno' ? 'Reporte por alumno' : tabActiva === 'Por fecha' ? 'Reporte por fecha' : tabActiva}</h3>
                    <div className="reporte-tabla-scroll"><table className="detail-table">
                        <thead><tr><th>Fecha</th><th>Matrícula</th><th>Alumno</th><th>Estado</th><th>Hora</th><th>Observación</th></tr></thead>
                        <tbody>{filas.map((r,i) => <tr key={`${r.estudianteId}-${r.fecha}-${i}`}><td>{r.fecha}</td><td>{r.matricula || '-'}</td><td>{r.nombre}</td><td>{r.estado}</td><td>{r.hora}</td><td>{r.observacion || '-'}</td></tr>)}
                        {!filas.length && <tr><td colSpan={6}>No hay registros para mostrar.</td></tr>}
                        </tbody>
                    </table></div>
                </div>
            )}
            <footer className="reportes-footer"><span>Reportes de asistencia</span><span>{desde} — {hasta}</span></footer>
        </div>
    );
}
