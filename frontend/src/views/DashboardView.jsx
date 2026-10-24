import { useState, useEffect } from 'react'
import '../components/Dashboard.css'
import { API_BASE_URL } from "../config.jsx"

function DashboardView({ onNavigate }) {
    const [dashboardData, setDashboardData] = useState({
        totalAlumnos: 0,
        presentesHoy: 0,
        porcentajePresentes: 0,
        ausentesHoy: 0,
        porcentajeAusentes: 0,
        tardanzasHoy: 0,
        porcentajeTardanzas: 0,
        ultimasAsistencias: []
    })
    const [loading, setLoading] = useState(true)

    // Formatear la fecha actual dinámicamente
    const fechaHoyFormateada = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwt_token')

            try {
                const response = await fetch(`${API_BASE_URL}/api/asistencias/resumen`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setDashboardData(data)
                } else {
                    console.error("Error al obtener los datos del Dashboard. Status:", response.status)
                }
            } catch (err) {
                console.error('Error de red:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'PRESENTE': return 'status present'
            case 'AUSENTE': return 'status absent'
            case 'TARDE': return 'status late'
            case 'JUSTIFICADO': return 'status justified'
            default: return 'status pending'
        }
    }

    return (
        <div className="dashboard-body">
            <div className="dashboard-title-area">
                <div>
                    <h1>Dashboard</h1>
                    <p>Resumen general del control de asistencia</p>
                </div>
                <div className="date-badge" style={{ textTransform: 'capitalize' }}>
                    📅 {fechaHoyFormateada}
                </div>
            </div>

            {/* Tarjetas de Métricas superiores */}
            <div className="metrics-grid">
                <div className="metric-card blue">
                    <span className="metric-icon">👥</span>
                    <div>
                        <h2>{loading ? '...' : dashboardData.totalAlumnos}</h2>
                        <p>Total de alumnos</p>
                    </div>
                </div>

                <div className="metric-card green">
                    <span className="metric-icon">✅</span>
                    <div>
                        <h2>
                            {loading ? '...' : dashboardData.presentesHoy}{' '}
                            <span className="badge-percent">{loading ? '0%' : `${dashboardData.porcentajePresentes}%`}</span>
                        </h2>
                        <p>Presentes hoy</p>
                    </div>
                </div>

                <div className="metric-card red">
                    <span className="metric-icon">❌</span>
                    <div>
                        <h2>
                            {loading ? '...' : dashboardData.ausentesHoy}{' '}
                            <span className="badge-percent">{loading ? '0%' : `${dashboardData.porcentajeAusentes}%`}</span>
                        </h2>
                        <p>Ausentes hoy</p>
                    </div>
                </div>

                <div className="metric-card yellow">
                    <span className="metric-icon">⏰</span>
                    <div>
                        <h2>
                            {loading ? '...' : dashboardData.tardanzasHoy}{' '}
                            <span className="badge-percent">{loading ? '0%' : `${dashboardData.porcentajeTardanzas}%`}</span>
                        </h2>
                        <p>Tardanzas hoy</p>
                    </div>
                </div>
            </div>

            {/* Sección de Tablas y Accesos Rápidos */}
            <div className="content-grid">
                <div className="card table-card">
                    <h3>Últimas asistencias registradas</h3>
                    {loading ? (
                        <p style={{ padding: '1rem', textAlign: 'center' }}>Cargando registros...</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre del alumno</th>
                                <th>Grado</th>
                                <th>Sección</th>
                                <th>Estado</th>
                                <th>Hora</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dashboardData.ultimasAsistencias && dashboardData.ultimasAsistencias.length > 0 ? (
                                dashboardData.ultimasAsistencias.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td>{index + 1}</td>
                                        <td>{item.nombreAlumno}</td>
                                        <td>{item.gradoNombre}</td>
                                        <td>{item.seccionNombre}</td>
                                        <td>
                                                <span className={getBadgeClass(item.estado)}>
                                                    {item.estado}
                                                </span>
                                        </td>
                                        <td>{item.hora ? item.hora.substring(0, 5) : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        No se han registrado asistencias el día de hoy.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Accesos Rápidos */}
                <div className="card quick-access-card">
                    <h3>Accesos rápidos</h3>
                    <div className="quick-grid">
                        <button className="quick-btn" onClick={() => onNavigate('alumnos')}>👥<br/>Gestionar Alumnos</button>
                        <button className="quick-btn" onClick={() => onNavigate('profesores')}>👨‍🏫<br/>Gestionar Profesores</button>
                        <button className="quick-btn" onClick={() => onNavigate('grados')}>📚<br/>Grados y Secciones</button>
                        <button className="quick-btn" onClick={() => onNavigate('horarios')}>⏰<br/>Horarios</button>
                        <button className="quick-btn" onClick={() => onNavigate('control-asistencia')}>✅<br/>Control de Asistencia</button>
                        <button className="quick-btn" onClick={() => onNavigate('reportes')}>📈<br/>Reportes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardView