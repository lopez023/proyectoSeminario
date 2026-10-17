import { useState } from 'react'
import './ProfesoresView.css'

function ProfesoresView() {
    const [modalAbierto, setModalAbierto] = useState(false)
    const [estadoProfesor, setEstadoProfesor] = useState('Activo')

    const handleActualizarProfesor = (e) => {
        e.preventDefault()
        alert('Datos y estado del profesor actualizados correctamente.')
        setModalAbierto(false)
    }

    return (
        <div className="profesores-layout">
            {/* 1. SECCIÓN SUPERIOR IZQUIERDA: Información del Profesor, Grado y Sección */}
            <div className="profesor-info-card">
                <div className="profesor-avatar">👨‍🏫</div>
                <div>
                    <h2>Lic. Carlos Mendoza</h2>
                    <p className="grado-asignado">📚 Grado: <strong>3.° Primaria</strong> | Sección: <strong>A</strong></p>
                    <span className="status-badge active">{estadoProfesor}</span>
                </div>
            </div>

            {/* 2. SECCIÓN SUPERIOR DERECHA: Botón para actualizar datos y estado */}
            <div className="profesor-acciones-card">
                <button className="btn-actualizar-prof" onClick={() => setModalAbierto(true)}>
                    🔄 Actualizar Datos y Estado
                </button>
            </div>

            {/* 3. SECCIÓN INFERIOR (Abarca izquierda y derecha): Listado de estudiantes del grado */}
            <div className="profesor-estudiantes-card">
                <div className="table-header-flex">
                    <h3>Estudiantes asignados a este grado y sección</h3>
                    <span className="total-badge">Total: 4 alumnos</span>
                </div>

                <table className="data-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre del Alumno</th>
                        <th>Grado</th>
                        <th>Sección</th>
                        <th>Estado de Asistencia Hoy</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Juan Pérez</td>
                        <td>3.° Primaria</td>
                        <td>A</td>
                        <td><span className="status present">Presente</span></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>María López</td>
                        <td>3.° Primaria</td>
                        <td>A</td>
                        <td><span className="status present">Presente</span></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Carlos García</td>
                        <td>3.° Primaria</td>
                        <td>A</td>
                        <td><span className="status absent">Ausente</span></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Ana Morales</td>
                        <td>3.° Primaria</td>
                        <td>A</td>
                        <td><span className="status late">Tarde</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Modal o formulario flotante para actualizar */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Actualizar Profesor y Estado</h3>
                        <form onSubmit={handleActualizarProfesor}>
                            <label>Nombre del Profesor:</label>
                            <input type="text" defaultValue="Lic. Carlos Mendoza" required />

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