import { useState, useEffect } from 'react'
import './ProfesoresView.css'
import { API_BASE_URL } from "../config.jsx";

function ProfesoresView() {
    const [docentes, setDocentes] = useState([])
    const [selectedDocenteId, setSelectedDocenteId] = useState('')
    const [dataDocente, setDataDocente] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [estadoProfesor, setEstadoProfesor] = useState('Activo')

    // 1. Cargar lista general de docentes para el selector
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/perfilDocente`)
            .then(res => res.json())
            .then(data => {
                setDocentes(data)
                if (data.length > 0) {
                    setSelectedDocenteId(data[0].id)
                }
            })
            .catch(err => console.error('Error al cargar docentes:', err))
    }, [])

    // 2. Cargar datos del docente seleccionado (Grado, Sección, Estudiantes y Asistencia)
    useEffect(() => {
        if (!selectedDocenteId) return

        setLoading(true)
        fetch(`${API_BASE_URL}/api/perfilDocente/${selectedDocenteId}/dashboard`)
            .then(res => res.json())
            .then(data => {
                setDataDocente(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error al obtener datos del docente:', err)
                setLoading(false)
            })
    }, [selectedDocenteId])

    // Función auxiliar para mapear el Enum de backend con la clase CSS correspondiente
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'PRESENTE': return 'status present'
            case 'AUSENTE': return 'status absent'
            case 'TARDE': return 'status late'
            case 'JUSTIFICADO': return 'status justified'
            default: return 'status pending'
        }
    }

    const handleActualizarProfesor = (e) => {
        e.preventDefault()
        alert('Datos y estado del profesor actualizados correctamente.')
        setModalAbierto(false)
    }

    return (
        <div className="profesores-layout">
            {/* SELECTOR DE DOCENTE */}
            <div className="profesor-selector-card" style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Seleccionar Docente:</label>
                <select
                    value={selectedDocenteId}
                    onChange={(e) => setSelectedDocenteId(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                    {docentes.map(doc => (
                        <option key={doc.id} value={doc.id}>
                            {doc.nombre} {doc.primerApellido}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                    <p>Cargando información del docente y estudiantes...</p>
                </div>
            ) : dataDocente ? (
                <>
                    {/* 1. SECCIÓN SUPERIOR IZQUIERDA: Información del Profesor */}
                    <div className="profesor-info-card">
                        <div className="profesor-avatar">👨‍🏫</div>
                        <div>
                            <h2><strong>{dataDocente.nombreCompleto}</strong></h2>
                            <p className="grado-asignado">
                                📚 Grado: <strong>{dataDocente.gradoNombre}</strong> | Sección: <strong>{dataDocente.seccionNombre}</strong>
                            </p>
                            <span className="status-badge active">{estadoProfesor}</span>
                        </div>
                    </div>

                    {/* 2. SECCIÓN SUPERIOR DERECHA: Botón de acciones */}
                    <div className="profesor-acciones-card">
                        <button className="btn-actualizar-prof" onClick={() => setModalAbierto(true)}>
                             Actualizar Datos y Estado
                        </button>
                    </div>

                    {/* 3. SECCIÓN INFERIOR: Listado de estudiantes */}
                    <div className="profesor-estudiantes-card">
                        <div className="table-header-flex">
                            <h3>Estudiantes asignados a este grado y sección</h3>
                            <span className="total-badge">Total: {dataDocente.estudiantes.length} alumnos</span>
                        </div>

                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre del Alumno</th>
                                <th>Grado</th>
                                <th>Sección</th>
                                <th>Estado de Asistencia (Último Día)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataDocente.estudiantes.length > 0 ? (
                                dataDocente.estudiantes.map((est, index) => (
                                    <tr key={est.id}>
                                        <td>{index + 1}</td>
                                        <td>{est.nombreCompleto}</td>
                                        <td>{est.gradoNombre}</td>
                                        <td>{est.seccionNombre}</td>
                                        <td>
                                                <span className={getBadgeClass(est.estadoAsistenciaHoy)}>
                                                    {est.estadoAsistenciaHoy || 'Sin Registro'}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>
                                        No hay estudiantes asignados a este docente.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : null}

            {/* Modal de actualización */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Actualizar Profesor y Estado</h3>
                        <form onSubmit={handleActualizarProfesor}>
                            <label>Nombre del Profesor:</label>
                            <input type="text" defaultValue={dataDocente?.nombreCompleto || ''} required />

                            <label>Estado:</label>
                            <select value={estadoProfesor} onChange={(e) => setEstadoProfesor(e.target.value)}>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                                <option value="Licencia">En Licencia</option>
                            </select>

                            <div className="modal-actions">
                                <button type="submit" className="btn-guardar">Guardar Cambios</button>
                                <button type="button" className="btn-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfesoresView