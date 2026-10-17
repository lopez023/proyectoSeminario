import { useState, useEffect } from 'react'
import '../components/Dashboard.css'
import { API_BASE_URL } from "../../config.jsx";

function DashboardView({ onNavigate }) {
    const [totalAlumnos, setTotalAlumnos] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTotalAlumnos = async () => {
            const token = localStorage.getItem('jwt_token')

            try {
                const response = await fetch(`${API_BASE_URL}/api/estudiantes/cantidadTotal`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log("Dato crudo recibido de la API:", data)

                    // Forzamos la conversión a número por seguridad
                    const cantidadNumerica = Number(data)
                    setTotalAlumnos(cantidadNumerica)
                } else {
                    console.error("Error en la respuesta. Status:", response.status)
                }
            } catch (err) {
                console.error('Error de red:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTotalAlumnos()
    }, [])

    return (
        <div className="dashboard-body">
            <div className="dashboard-title-area">
                <div>
                    <h1>Dashboard</h1>
                    <p>Resumen general del control de asistencia</p>
                </div>
                <div className="date-badge">📅 Viernes, 3 de octubre de 2026</div>
            </div>

            {/* Tarjetas de Métricas superiores */}
            <div className="metrics-grid">
                <div className="metric-card blue">
                    <span className="metric-icon">👥</span>
                    <div>
                        <h2>{loading ? '...' : totalAlumnos}</h2>
                        <p>Total de alumnos</p>
                    </div>
                </div>
                <div className="metric-card green">
                    <span className="metric-icon">✅</span>
                    <div>
                        <h2>98 <span className="badge-percent">82%</span></h2>
                        <p>Presentes hoy</p>
                    </div>
                </div>
                <div className="metric-card red">
                    <span className="metric-icon">❌</span>
                    <div>
                        <h2>15 <span className="badge-percent">13%</span></h2>
                        <p>Ausentes hoy</p>
                    </div>
                </div>
                <div className="metric-card yellow">
                    <span className="metric-icon">⏰</span>
                    <div>
                        <h2>7 <span className="badge-percent">6%</span></h2>
                        <p>Tardanzas hoy</p>
                    </div>
                </div>
            </div>

            {/* Sección de Tablas y Accesos Rápidos */}
            <div className="content-grid">
                <div className="card table-card">
                    <h3>Últimas asistencias registradas</h3>
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
                        <tr>
                            <td>1</td>
                            <td>Juan Pérez</td>
                            <td>3.° Primaria</td>
                            <td>A</td>
                            <td><span className="status present">Presente</span></td>
                            <td>7:28 AM</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>María López</td>
                            <td>2.° Primaria</td>
                            <td>B</td>
                            <td><span className="status present">Presente</span></td>
                            <td>7:30 AM</td>
                        </tr>
                        </tbody>
                    </table>
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