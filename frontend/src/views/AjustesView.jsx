import { useState } from 'react'
import './AjustesView.css'

function AjustesView() {
    const [config, setConfig] = useState({
        nombreInstitucion: 'Colegio Mi Escuela',
        anioLectivo: '2026',
        horaIngreso: '07:30',
        tiempoTolerancia: '15',
        notificacionesEmail: true,
        modoOscuro: false,
        frecuenciaRespaldo: 'diario'
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setConfig({
            ...config,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSaveSettings = (e) => {
        e.preventDefault()
        alert('Configuración y ajustes guardados correctamente en el sistema.')
    }

    return (
        <div className="ajustes-layout">
            <div className="ajustes-header">
                <div>
                    <h2>🛠️ Ajustes del Sistema</h2>
                    <p>Personaliza los parámetros generales, institucionales y de asistencia</p>
                </div>
            </div>

            <form onSubmit={handleSaveSettings} className="ajustes-grid-form">
                {/* Sección 1: Datos Institucionales */}
                <div className="card-ajustes">
                    <h3>🏫 Datos Institucionales</h3>
                    <p className="card-desc">Información general que aparecerá en los reportes y documentos.</p>

                    <label>Nombre de la Institución:</label>
                    <input
                        type="text"
                        name="nombreInstitucion"
                        value={config.nombreInstitucion}
                        onChange={handleChange}
                    />

                    <label>Año Lectivo / Periodo Activo:</label>
                    <input
                        type="text"
                        name="anioLectivo"
                        value={config.anioLectivo}
                        onChange={handleChange}
                    />
                </div>

                {/* Sección 2: Reglas de Asistencia */}
                <div className="card-ajustes">
                    <h3>⏰ Reglas de Asistencia</h3>
                    <p className="card-desc">Define los horarios y tolerancias para el control diario.</p>

                    <label>Hora oficial de ingreso:</label>
                    <input
                        type="time"
                        name="horaIngreso"
                        value={config.horaIngreso}
                        onChange={handleChange}
                    />

                    <label>Minutos de tolerancia para tardanza:</label>
                    <input
                        type="number"
                        name="tiempoTolerancia"
                        value={config.tiempoTolerancia}
                        onChange={handleChange}
                    />
                </div>

                {/* Sección 3: Notificaciones y Automatización */}
                <div className="card-ajustes">
                    <h3>🔔 Notificaciones y Alertas</h3>
                    <p className="card-desc">Gestiona el comportamiento de las alertas automáticas.</p>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            name="notificacionesEmail"
                            id="notifEmail"
                            checked={config.notificacionesEmail}
                            onChange={handleChange}
                        />
                        <label htmlFor="notifEmail">Enviar alertas por correo electrónico ante ausencias</label>
                    </div>

                    <label style={{ marginTop: '1rem', display: 'block' }}>Frecuencia de respaldos automáticos de BD:</label>
                    <select name="frecuenciaRespaldo" value={config.frecuenciaRespaldo} onChange={handleChange}>
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                    </select>
                </div>

                {/* Sección 4: Apariencia */}
                <div className="card-ajustes">
                    <h3>🎨 Apariencia y Accesibilidad</h3>
                    <p className="card-desc">Personalización visual del entorno de trabajo.</p>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            name="modoOscuro"
                            id="darkMod"
                            checked={config.modoOscuro}
                            onChange={handleChange}
                        />
                        <label htmlFor="darkMod">Habilitar Modo Oscuro (Experimental)</label>
                    </div>
                </div>

                {/* Botón Guardar Global */}
                <div className="ajustes-footer-actions">
                    <button type="submit" className="btn-guardar-cambios">💾 Guardar Todos los Ajustes</button>
                </div>
            </form>
        </div>
    )
}

export default AjustesView