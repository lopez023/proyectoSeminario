import { useState } from 'react'
import './GradosView.css'

function GradosView() {
    // Lista de ejemplo con grados, secciones y profesores asignados
    const [gradosData] = useState([
        {
            id: 1,
            grado: 'Comunion y Confirmacion',
            descripcion: ' ',
            secciones: [
                { seccion: 'A', profesor: 'Lic. Carlos Mendoza', alumnosCount: 28, estado: 'Activo' }
            ]
        },
        {
            id: 2,
            grado: 'Comunion y Confirmacion',
            descripcion: ' ',
            secciones: [
                { seccion: 'B', profesor: 'Licda. Sofía Morales', alumnosCount: 30, estado: 'Activo' }
            ]
        },
        {
            id: 3,
            grado: 'Comunion y Confirmacion',
            descripcion: ' ',
            secciones: [
                { seccion: 'C', profesor: 'Lic. Roberto Castillo', alumnosCount: 26, estado: 'Activo' }
            ]
        }
    ])

    return (
        <div className="grados-layout">
            <div className="grados-header">
                <div>
                    <h2>📚 Grados y Secciones Académicas</h2>
                    <p>Distribución de secciones y docentes asignados por grado</p>
                </div>
                <button className="btn-nuevo-grado" onClick={() => alert('Abrir modal para agregar nuevo grado o sección')}>
                    ➕ Asignar Grado / Sección
                </button>
            </div>

            <div className="grados-grid">
                {gradosData.map((item) => (
                    <div key={item.id} className="grado-card">
                        <div className="grado-card-header">
                            <h3>{item.grado}</h3>
                            <span className="grado-desc">{item.descripcion}</span>
                        </div>

                        <div className="secciones-container">
                            {item.secciones.map((sec, index) => (
                                <div key={index} className="seccion-item">
                                    <div className="seccion-badge-info">
                                        <span className="badge-seccion">Sección {sec.seccion}</span>
                                        <span className="alumnos-count">👥 {sec.alumnosCount} alumnos</span>
                                    </div>

                                    <div className="profesor-asignado-box">
                                        <small>Profesor encargado:</small>
                                        <p className="profesor-nombre">👨‍🏫 {sec.profesor}</p>
                                        <span className={`estado-prof ${sec.estado.toLowerCase()}`}>
                      ● {sec.estado}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GradosView