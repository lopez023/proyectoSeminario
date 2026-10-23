import { useState, useEffect } from 'react'
import './AlumnosView.css'

import { API_BASE_URL } from "../config.jsx";

function AlumnosView() {
    // Almacena la sección completa seleccionada (grado, docente y lista de estudiantes)
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null)
    const [seccionesList, setSeccionesList] = useState([])

    // Lista completa de secciones para llenar el select del formulario de inserción
    const [seccionesDisponibles, setSeccionesDisponibles] = useState([])

    // Modales y control de edición
    const [modalActualizarAbierto, setModalActualizarAbierto] = useState(false)
    const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false)
    const [idAlumnoBuscar, setIdAlumnoBuscar] = useState('')
    const [codigoEditando, setCodigoEditando] = useState(null) // Almacena el código si estamos editando

    // Estado para el formulario de nuevo/actualizar alumno
    const [nuevoAlumno, setNuevoAlumno] = useState({
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        telefonoEncargado: '',
        fechaNacimiento: '',
        seccionId: ''
    })

    // Cargar las secciones con detalles y la lista simple al montar el componente usando JWT
    useEffect(() => {
        cargarSeccionesConDetalles()
        cargarSeccionesDisponibles()
    }, [])

    const cargarSeccionesConDetalles = async () => {
        const token = localStorage.getItem('jwt_token')

        if (!token) {
            alert('No se encontró una sesión activa. Por favor, inicia sesión nuevamente.')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/secciones/con-estudiantes`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSeccionesList(data)
                if (data.length > 0 && !seccionSeleccionada) {
                    setSeccionSeleccionada(data[0]) // Selecciona la primera sección por defecto
                }
            } else if (response.status === 401 || response.status === 403) {
                alert('Sesión expirada o sin permisos suficientes. Vuelve a iniciar sesión.')
            } else {
                console.error('Error al obtener secciones con estudiantes. Código:', response.status)
            }
        } catch (error) {
            console.error('Error de red al conectar con /api/secciones/con-estudiantes:', error)
        }
    }

    // Consulta al endpoint GET /api/secciones para obtener todas las secciones disponibles en el selector
    const cargarSeccionesDisponibles = async () => {
        const token = localStorage.getItem('jwt_token')
        if (!token) return

        try {
            const response = await fetch(`${API_BASE_URL}/api/secciones`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSeccionesDisponibles(data)
            } else {
                console.error('Error al obtener la lista de secciones para el formulario.')
            }
        } catch (error) {
            console.error('Error de red al conectar con /api/secciones:', error)
        }
    }

    const handleInsertarChange = (e) => {
        const { name, value } = e.target
        setNuevoAlumno({
            ...nuevoAlumno,
            [name]: value
        })
    }

    // Método unificado para CREAR (POST) o ACTUALIZAR (PUT)
    const handleGuardarSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('jwt_token')

        if (!token) {
            alert('Sesión expirada. Inicia sesión nuevamente.')
            return
        }

        const esActualizacion = codigoEditando !== null
        const url = esActualizacion
            ? `${API_BASE_URL}/api/estudiantes/${codigoEditando}`
            : `${API_BASE_URL}/api/estudiantes`
        const method = esActualizacion ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nuevoAlumno.nombre,
                    primerApellido: nuevoAlumno.primerApellido,
                    segundoApellido: nuevoAlumno.segundoApellido,
                    telefonoEncargado: nuevoAlumno.telefonoEncargado,
                    fechaNacimiento: nuevoAlumno.fechaNacimiento,
                    seccionId: Number(nuevoAlumno.seccionId)
                })
            })

            if (response.ok) {
                alert(esActualizacion ? '¡Alumno actualizado exitosamente!' : '¡Alumno registrado exitosamente en la sección!')

                // Limpiar estados y cerrar modales
                setModalInsertarAbierto(false)
                setCodigoEditando(null)
                setNuevoAlumno({
                    nombre: '',
                    primerApellido: '',
                    segundoApellido: '',
                    telefonoEncargado: '',
                    fechaNacimiento: '',
                    seccionId: ''
                })
                setIdAlumnoBuscar('')
                cargarSeccionesConDetalles()
            } else if (response.status === 401 || response.status === 403) {
                alert('No tienes permisos para realizar esta acción.')
            } else {
                alert('Error al procesar la solicitud en el servidor.')
            }
        } catch (error) {
            console.error('Error de red:', error)
        }
    }

    // Busca al alumno por código antes de abrir el formulario de actualización
    const handleActualizarSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('jwt_token')

        if (!token || !idAlumnoBuscar.trim()) {
            alert('Por favor, ingresa un código válido.')
            return
        }


        try {
            const response = await fetch(`${API_BASE_URL}//localhost:8080/api/estudiantes/${idAlumnoBuscar.trim()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const alumno = await response.json()

                // Llenamos el formulario con los datos existentes
                setNuevoAlumno({
                    nombre: alumno.nombre || '',
                    primerApellido: alumno.primerApellido || '',
                    segundoApellido: alumno.segundoApellido || '',
                    telefonoEncargado: alumno.telefonoEncargado || '',
                    fechaNacimiento: alumno.fechaNacimiento || '',
                    seccionId: alumno.seccionId || ''
                })

                setCodigoEditando(idAlumnoBuscar)     // Activamos modo edición con este código
                setModalActualizarAbierto(false)      // Cerramos modal de búsqueda
                setModalInsertarAbierto(true)         // Abrimos el formulario principal reutilizado
            } else {
                alert('No se encontró ningún estudiante con el código: ' + idAlumnoBuscar)
            }
        } catch (error) {
            console.error('Error de red al buscar el alumno:', error)
        }
    }

    // Los estudiantes se obtienen de la sección seleccionada gracias al @OneToMany
    const listaAlumnosActual = seccionSeleccionada ? seccionSeleccionada.estudiantes : []

    return (
        <div className="alumnos-layout">
            {/* Columna izquierda: Secciones basadas en tu endpoint y entidades */}
            <div className="alumnos-sidebar-filtro">
                <h3>Grados y Secciones</h3>
                <p className="sub-text">Seleccione una sección:</p>
                <div className="filtro-lista">
                    {seccionesList.length > 0 ? (
                        seccionesList.map((sec) => {
                            const estaActivo = seccionSeleccionada?.id === sec.id
                            const nombreGrado = sec.grado ? sec.grado.nombreGrado : 'Sin Grado'
                            const nombreDocente = sec.docente ? `${sec.docente.nombre} ${sec.docente.primerApellido}` : 'Sin docente'

                            return (
                                <button
                                    key={sec.id}
                                    className={`filtro-btn ${estaActivo ? 'active' : ''}`}
                                    onClick={() => setSeccionSeleccionada(sec)}
                                    style={{ textAlign: 'left', marginBottom: '0.5rem' }}
                                >
                                    <strong>{nombreGrado} - Sec. {sec.nombre}</strong>
                                    <span className="profesor-sublabel" style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                                        👨‍🏫 {nombreDocente}
                                    </span>
                                </button>
                            )
                        })
                    ) : (
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Cargando secciones...</p>
                    )}
                </div>
            </div>

            {/* Columna central: Listado detallado de alumnos */}
            <div className="alumnos-contenido-central">
                <div className="view-header">
                    <h2>Listado de Alumnos</h2>
                    <span className="badge-filtro">
                        Mostrando: {seccionSeleccionada && seccionSeleccionada.grado ? `${seccionSeleccionada.grado.nombreGrado} Sección ${seccionSeleccionada.nombre}` : 'Seleccione una sección'}
                    </span>
                </div>

                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Teléfono Encargado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listaAlumnosActual && listaAlumnosActual.length > 0 ? (
                        listaAlumnosActual.map((alumno) => (
                            <tr key={alumno.id}>
                                <td><code className="codigo-badge">{alumno.codigoEstudiante}</code></td>
                                <td><strong>{`${alumno.nombre} ${alumno.primerApellido} ${alumno.segundoApellido || ''}`}</strong></td>
                                <td>{alumno.edad} años</td>
                                <td>📞 {alumno.telefonoEncargado}</td>
                                <td><button className="accion-link">Ver detalles</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                                No hay alumnos registrados en esta sección.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Columna derecha: Acciones rápidas */}
            <div className="alumnos-panel-derecho">
                <h3>Acciones de Alumnos</h3>
                <p className="panel-desc">Gestión de registros individuales.</p>

                <button
                    className="primary-action-btn"
                    onClick={() => {
                        setCodigoEditando(null); // Aseguramos que sea modo creación
                        setNuevoAlumno({ nombre: '', primerApellido: '', segundoApellido: '', telefonoEncargado: '', fechaNacimiento: '', seccionId: '' });
                        setModalActualizarAbierto(false); // Cerramos el de búsqueda si estaba abierto
                        setModalInsertarAbierto(true);
                    }}
                    style={{ marginBottom: '0.8rem', background: '#16a34a' }}
                >
                    ➕ Insertar Nuevo Alumno
                </button>

                <button
                    className="primary-action-btn"
                    onClick={() => {
                        setModalInsertarAbierto(false); // Cerramos el de insertar si estaba abierto
                        setModalActualizarAbierto(true);
                    }}
                >
                    🔄 Actualizar datos de un alumno
                </button>

                {/* Formulario (INSERTAR / ACTUALIZAR) */}
                {modalInsertarAbierto && (
                    <div className="form-actualizar-card form-card-insertar">
                        <h4>{codigoEditando ? `Actualizar Alumno (${codigoEditando})` : 'Registrar Nuevo Alumno'}</h4>
                        <form onSubmit={handleGuardarSubmit}>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Ej. Carlos Alberto"
                                value={nuevoAlumno.nombre}
                                onChange={handleInsertarChange}
                                required
                            />

                            <label>Primer Apellido:</label>
                            <input
                                type="text"
                                name="primerApellido"
                                placeholder="Ej. Mendoza"
                                value={nuevoAlumno.primerApellido}
                                onChange={handleInsertarChange}
                                required
                            />

                            <label>Segundo Apellido:</label>
                            <input
                                type="text"
                                name="segundoApellido"
                                placeholder="Ej. Gómez"
                                value={nuevoAlumno.segundoApellido}
                                onChange={handleInsertarChange}
                            />

                            <label>Teléfono del Encargado:</label>
                            <input
                                type="text"
                                name="telefonoEncargado"
                                placeholder="Ej. +502 5555-1234"
                                value={nuevoAlumno.telefonoEncargado}
                                onChange={handleInsertarChange}
                                required
                            />

                            <label>Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={nuevoAlumno.fechaNacimiento}
                                onChange={handleInsertarChange}
                                required
                            />

                            {/* Selector de sección dinámico */}
                            <label>Sección a Asignar:</label>
                            <select
                                name="seccionId"
                                value={nuevoAlumno.seccionId}
                                onChange={handleInsertarChange}
                                required
                                className="select-seccion-custom"
                            >
                                <option value="">-- Seleccione una sección --</option>
                                {seccionesDisponibles.map((sec) => (
                                    <option key={sec.id} value={sec.id}>
                                        {sec.grado ? sec.grado.nombreGrado : 'Grado'} - Sección {sec.nombre}
                                    </option>
                                ))}
                            </select>

                            <div className="form-actions">
                                <button type="submit" className="btn-guardar" style={{ background: codigoEditando ? '#2563eb' : '#16a34a' }}>
                                    {codigoEditando ? 'Actualizar Cambios' : 'Guardar'}
                                </button>
                                <button type="button" className="btn-cancelar" onClick={() => { setModalInsertarAbierto(false); setCodigoEditando(null); }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Formulario para Buscar el Alumno antes de actualizar */}
                {modalActualizarAbierto && (
                    <div className="form-actualizar-card form-card-buscar">
                        <h4>Buscar Alumno a Actualizar</h4>
                        <form onSubmit={handleActualizarSubmit}>
                            <label>Código de Estudiante:</label>
                            <input
                                type="text"
                                placeholder="Ej. EST-2026-1234"
                                value={idAlumnoBuscar}
                                onChange={(e) => setIdAlumnoBuscar(e.target.value)}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" className="btn-guardar">Buscar / Editar</button>
                                <button type="button" className="btn-cancelar" onClick={() => setModalActualizarAbierto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlumnosView