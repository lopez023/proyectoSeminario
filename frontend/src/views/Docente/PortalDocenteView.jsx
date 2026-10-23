import React, { useState, useEffect } from 'react';
import './PortalDocenteView.css';
import ControlAsistenciaDocenteView from './ControlAsistenciaDocenteView';
import ReportesDocenteView from './ReportesDocenteView';
import { API_BASE_URL } from "../../config.jsx";

function PortalDocenteView({ onLogout }) {
    const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio' | 'asistencia' | 'reportes'
    const [mostrarPerfilCard, setMostrarPerfilCard] = useState(false);

    // Estados para la información dinámica del usuario basada en el DTO de la API
    const [userData, setUserData] = useState({
        id: '',
        username: 'Cargando...',
        email: '',
        estado: true,
        fechaCreacion: '',
        roles: []
    });
    const [loadingUsuario, setLoadingUsuario] = useState(true);

    // Función auxiliar para decodificar el username/sub desde el token JWT guardado en localStorage
    const obtenerUsuarioDelToken = (token) => {
        try {
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            return decoded.sub || decoded.username || null;
        } catch (error) {
            console.error('Error al decodificar el token JWT:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchDatosUsuario = async () => {
            const token = localStorage.getItem('jwt_token');

            if (!token) {
                setLoadingUsuario(false);
                return;
            }

            const username = obtenerUsuarioDelToken(token);

            if (!username) {
                setLoadingUsuario(false);
                return;
            }

            try {
                // Petición a tu API: localhost:8080/api/usuarios/usuario/{usuario}
                const response = await fetch(`${API_BASE_URL}/api/usuarios/usuario/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // data contiene { email, estado, fechaCreacion, id, roles, username }
                } else {
                    console.error('Error al obtener los datos del usuario. Status:', response.status);
                }
            } catch (err) {
                console.error('Error de red al conectar con la API de usuarios:', err);
            } finally {
                setLoadingUsuario(false);
            }
        };

        fetchDatosUsuario();
    }, []);

    return (
        <div className="docente-layout" onClick={() => setMostrarPerfilCard(false)}>
            {/* Sidebar Fijo */}
            <aside className="docente-sidebar" onClick={(e) => e.stopPropagation()}>
                <div className="sidebar-brand">
                    <span className="brand-icon">🏫</span>
                    <h2>Catequistes de la Paroquia del Espiritu Santo, catedral Quetzaltenango</h2>
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
                                    <span className="popover-label">Nombre de Usuario</span>
                                    <strong className="popover-val">{loadingUsuario ? 'Cargando...' : userData.username}</strong>
                                </div>

                                <div className="popover-item">
                                    <span className="popover-label">📧 Correo</span>
                                    <span className="popover-val">{loadingUsuario ? 'Cargando...' : userData.email}</span>
                                </div>

                                <div className="popover-item">
                                    <span className="popover-label">📅 Fecha de Creación</span>
                                    <span className="popover-val">{loadingUsuario ? 'Cargando...' : userData.fechaCreacion}</span>
                                </div>

                                <div className="popover-grid">
                                    <div>
                                        <span className="popover-label">Rol(es)</span>
                                        <strong className="popover-highlight">
                                            {loadingUsuario ? '...' : userData.roles.join(', ')}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="popover-label">Estado</span>
                                        <strong className="popover-highlight">
                                            {loadingUsuario ? '...' : (userData.estado ? 'Activo' : 'Inactivo')}
                                        </strong>
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
                            <p className="user-name">{loadingUsuario ? '...' : userData.username}</p>
                            <p className="user-role">{userData.roles && userData.roles.length > 0 ? userData.roles[0].toUpperCase() : 'DOCENTE'}</p>
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
                                <h1>¡Bienvenido, {loadingUsuario ? '...' : userData.username}!</h1>
                                <p>Aquí puedes registrar y consultar la asistencia de tus alumnos.</p>
                            </div>
                            <div className="welcome-image">
                                <span className="welcome-emoji"> 📚</span>
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