import React, { useState } from 'react';
import './PortalDocenteView.css';
import ControlAsistenciaDocenteView from './ControlAsistenciaDocenteView';
import ReportesDocenteView from './ReportesDocenteView';

function PortalDocenteView({ onLogout }) {
    const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio' | 'asistencia' | 'reportes'
    const [mostrarPerfilCard, setMostrarPerfilCard] = useState(false);

    // Datos del perfil (puedes personalizarlos o cargarlos dinámicamente)
    const user = JSON.parse(localStorage.getItem('user')) || {
        nombreCompleto: 'Ana María López Pérez',
        correo: 'ana.lopez@miescuela.edu.gt',
        telefono: '+502 5555-4321',
        rol: 'Docente / Profesora',
        grado: '3.° Primaria',
        seccion: 'Sección A'
    };

    return (
        <div className="docente-layout" onClick={() => setMostrarPerfilCard(false)}>
            {/* Sidebar Fijo */}
            <aside className="docente-sidebar" onClick={(e) => e.stopPropagation()}>
                <div className="sidebar-brand">
                    <span className="brand-icon">🏫</span>
                    <h2>Mi Escuela</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${vistaActual === 'inicio' ? 'active' : ''}`}
                        onClick={() => { setVistaActual('inicio'); setMostrarPerfilCard(false); }}
                    >
                        <span>🏠</span> Inicio
                    </button>
                    <button
                        className={`nav-item ${vistaActual === 'asistencia' ? 'active' : ''}`}
                        onClick={() => { setVistaActual('asistencia'); setMostrarPerfilCard(false); }}
                    >
                        <span>📅</span> Control de Asistencia
                    </button>
                    <button
                        className={`nav-item ${vistaActual === 'reportes' ? 'active' : ''}`}
                        onClick={() => { setVistaActual('reportes'); setMostrarPerfilCard(false); }}
                    >
                        <span>📊</span> Reportes
                    </button>
                </nav>

                {/* Footer con Tarjeta de Perfil Desplegable */}
                <div className="sidebar-footer">

                    {/* POP-OVER / TARJETA FLOTANTE DE PERFIL */}
                    {mostrarPerfilCard && (
                        <div className="profile-popover">
                            <div className="popover-header">
                                <span>Información del Usuario</span>
                                <button
                                    className="popover-close"
                                    onClick={() => setMostrarPerfilCard(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="popover-body">
                                <div className="popover-item">
                                    <span className="popover-label">Nombre Completo</span>
                                    <strong className="popover-val">{user.nombreCompleto}</strong>
                                </div>

                                <div className="popover-item">
                                    <span className="popover-label">📧 Correo</span>
                                    <span className="popover-val">{user.correo}</span>
                                </div>

                                <div className="popover-item">
                                    <span className="popover-label">📞 Teléfono</span>
                                    <span className="popover-val">{user.telefono}</span>
                                </div>

                                <div className="popover-grid">
                                    <div>
                                        <span className="popover-label">Rol</span>
                                        <strong className="popover-highlight">{user.rol}</strong>
                                    </div>
                                    <div>
                                        <span className="popover-label">Grado / Secc.</span>
                                        <strong className="popover-highlight">{user.grado} ({user.seccion})</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOTÓN DEL PERFIL INFERIOR IZQUIERDO */}
                    <div
                        className={`user-info user-info-clickable ${mostrarPerfilCard ? 'active' : ''}`}
                        onClick={() => setMostrarPerfilCard(!mostrarPerfilCard)}
                        title="Ver detalles del perfil"
                    >
                        <div className="user-avatar">👩‍🏫</div>
                        <div>
                            <p className="user-name">Prof. Ana López</p>
                            <p className="user-role">Profesora</p>
                        </div>
                    </div>

                    <button className="btn-logout" onClick={onLogout}>
                        <span>🚪</span> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Contenido Dinámico */}
            <main className="docente-main" onClick={(e) => e.stopPropagation()}>
                {vistaActual === 'inicio' && (
                    <>
                        <div className="welcome-banner">
                            <div className="welcome-text">
                                <h1>¡Bienvenida, Prof. Ana López!</h1>
                                <p>Aquí puedes registrar y consultar la asistencia de tus alumnos.</p>
                            </div>
                            <div className="welcome-image">
                                <span className="welcome-emoji">📚</span>
                            </div>
                        </div>

                        <h2 className="section-title">Accesos rápidos</h2>
                        <div className="quick-access-grid">
                            <div className="quick-card">
                                <div className="card-icon blue">📅</div>
                                <h3>Control de Asistencia</h3>
                                <p>Registra la asistencia del día de hoy.</p>
                                <button className="btn-card blue-bg" onClick={() => setVistaActual('asistencia')}>
                                    Ir al control
                                </button>
                            </div>

                            <div className="quick-card">
                                <div className="card-icon purple">📊</div>
                                <h3>Reportes</h3>
                                <p>Consulta y genera reportes de asistencia.</p>
                                <button className="btn-card purple-bg" onClick={() => setVistaActual('reportes')}>
                                    Ver reportes
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {vistaActual === 'asistencia' && (
                    <ControlAsistenciaDocenteView onVolver={() => setVistaActual('inicio')} />
                )}

                {vistaActual === 'reportes' && (
                    <ReportesDocenteView onVolver={() => setVistaActual('inicio')} />
                )}
            </main>
        </div>
    );
}

export default PortalDocenteView;