import { useState } from 'react'
import DashboardView from '../views/DashboardView'
import AlumnosView from '../views/AlumnosView'
import ProfesoresView from '../views/ProfesoresView'
import GradosView from '../views/GradosView.jsx'
import HorariosView from '../views/HorariosView'
import UsuariosView from '../views/UsuariosView'
import AjustesView from '../views/AjustesView'
import JustificacionesView from '../views/JustificacionesView'
import ControlAsistenciaView from '../views/ControlAsistenciaView'
import './MainLayout.css'

function MainLayout({ onLogout }) {
    const [currentView, setCurrentView] = useState('dashboard')

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>🎓 Catequistes de la Paroquia del Espiritu Santo, catedral Quetzaltenango</h2>
                    <p>Control de Asistencia</p>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-link-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentView('dashboard')}
                    >
                        📊 Dashboard
                    </button>

                    <button
                        className={`nav-link-btn ${currentView === 'alumnos' ? 'active' : ''}`}
                        onClick={() => setCurrentView('alumnos')}
                    >
                        👥 Alumnos
                    </button>

                    <button
                        className={`nav-link-btn ${currentView === 'profesores' ? 'active' : ''}`}
                        onClick={() => setCurrentView('profesores')}
                    >
                        👨‍🏫 Profesores
                    </button>

                    <button
                        className={`nav-link-btn ${currentView === 'grados' ? 'active' : ''}`}
                        onClick={() => setCurrentView('grados')}
                    >
                        📚 Grados y Secciones
                    </button>
                    <button
                        className={`nav-link-btn ${currentView === 'horarios' ? 'active' : ''}`}
                        onClick={() => setCurrentView('horarios')}
                    >
                        ⏰ Horarios
                    </button>

                    <p className="nav-section-title">ASISTENCIA</p>

                    <button
                        className={`nav-link-btn ${currentView === 'control-asistencia' ? 'active' : ''}`}
                        onClick={() => setCurrentView('control-asistencia')}
                    >
                        ✅ Control de Asistencia
                    </button>

                    <button
                        className={`nav-link-btn ${currentView === 'justificaciones' ? 'active' : ''}`}
                        onClick={() => setCurrentView('justificaciones')}
                    >
                        📝 Justificaciones
                    </button>

                    <p className="nav-section-title">CONFIGURACIÓN</p>

                    <button
                        className={`nav-link-btn ${currentView === 'usuarios' ? 'active' : ''}`}
                        onClick={() => setCurrentView('usuarios')}
                    >
                        ⚙️ Usuarios
                    </button>

                    <button
                        className={`nav-link-btn ${currentView === 'ajustes' ? 'active' : ''}`}
                        onClick={() => setCurrentView('ajustes')}
                    >
                        🛠️ Ajustes
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <input type="text" placeholder="Buscar alumno, profesor o reporte..." className="search-bar" />
                    <div className="user-profile">
                        <span>🔔</span>
                        <div className="user-info">
                            <strong>Administrador</strong>
                            <small>Sistema</small>
                        </div>
                        <button onClick={onLogout} className="logout-btn-top">Cerrar Sesión</button>
                    </div>
                </header>

                <div className="dynamic-view-container">
                    {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
                    {currentView === 'alumnos' && <AlumnosView />}
                    {currentView === 'profesores' && <ProfesoresView />}
                    {currentView === 'grados' && <GradosView />}
                    {currentView === 'horarios' && <HorariosView />}
                    {currentView === 'usuarios' && <UsuariosView />}
                    {currentView === 'ajustes' && <AjustesView />}
                    {currentView === 'justificaciones' && <JustificacionesView />}
                    {currentView === 'control-asistencia' && <ControlAsistenciaView />}
                </div>
            </main>
        </div>
    )
}

export default MainLayout