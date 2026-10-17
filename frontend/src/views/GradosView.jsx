import { useState } from 'react'
import './GradosView.css'

function GradosView() {
    // Lista de ejemplo con grados, secciones y profesores asignados
    const [gradosData] = useState([
        {
            id: 1,
            grado: '1.° Primaria',
            descripcion: 'Nivel básico de educación primaria',
            secciones: [
                { seccion: 'A', profesor: 'Lic. Carlos Mendoza', alumnosCount: 28, estado: 'Activo' },
                { seccion: 'B', profesor: 'Prof. Ana Gómez', alumnosCount: 25, estado: 'Activo' }
            ]
        },
        {
            id: 2,
            grado: '2.° Primaria',
            descripcion: 'Consolidación de lectoescritura',
            secciones: [
                { seccion: 'A', profesor: 'Licda. Sofía Morales', alumnosCount: 30, estado: 'Activo' },
                { seccion: 'B', profesor: 'Prof. Jorge Ramírez', alumnosCount: 27, estado: 'Activo' }
            ]
        },
        {
            id: 3,
            grado: '3.° Primaria',
            descripcion: 'Desarrollo de pensamiento lógico',
            secciones: [
                { seccion: 'A', profesor: 'Lic. Roberto Castillo', alumnosCount: 26, estado: 'Activo' },
                { seccion: 'B', profesor: 'Licda. Carmen Ruiz', alumnosCount: 29, estado: 'Licencia' }
            ]
        },
        {
            id: 4,
            grado: '4.° Primaria',
            descripcion: 'Transición a ciclos intermedios',
            secciones: [
                { seccion: 'A', profesor: 'Prof. Luis Herrera', alumnosCount: 24, estado: 'Activo' }
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