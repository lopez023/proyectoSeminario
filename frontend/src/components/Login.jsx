import { useState } from 'react'
import './Login.css'

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('')
    const [contrasenia, setContrasenia] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // 🏫 Cambia este valor por el nombre real de la institución
    const NOMBRE_ESCUELA = "Catequistes de la Paroquia del Espiritu Santo, catedral Quetzaltenango"

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, contrasenia }),
            })

            if (!response.ok) {
                throw new Error('Credenciales inválidas o error en el servidor')
            }

            const data = await response.json()
            const token = data.token || data.accessToken

            if (!token) {
                throw new Error('No se recibió el token de autenticación')
            }

            // 🔓 Decodificar JWT
            let role = 'PROFESOR'
            try {
                const base64Url = token.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                }).join(''))

                const decodedToken = JSON.parse(jsonPayload)
                const rolesArray = decodedToken.roles || decodedToken.authorities || []

                if (Array.isArray(rolesArray) && rolesArray.length > 0) {
                    role = rolesArray[0]
                } else {
                    role = decodedToken.role || decodedToken.rol || 'PROFESOR'
                }
            } catch (decodeErr) {
                console.error("Error al decodificar:", decodeErr)
            }

            localStorage.setItem('jwt_token', token)
            localStorage.setItem('user_role', role)
            onLoginSuccess(token, role)

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = (e) => {
        e.preventDefault()
        alert('La función de recuperación de contraseña se activará próximamente.')
    }

    return (
        <div className="login-page">
            <div className="login-card-modern">
                {/* Cabecera / Avatar e Identificación de la Escuela */}
                <div className="avatar-header">
                    <div className="avatar-circle">
                        <span>🏫</span>
                    </div>
                    {/* Nombre de la Escuela */}
                    <h2 className="title-text">{NOMBRE_ESCUELA}</h2>
                    <p className="subtitle-text">Control de Asistencia</p>
                </div>

                {error && (
                    <div className="login-error-msg">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modern-form">
                    {/* Campo Usuario */}
                    <div className="input-group-line">
                        <span className="field-icon">👤</span>
                        <input
                            type="text"
                            placeholder="Usuario / Correo"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="input-group-line">
                        <span className="field-icon">🔒</span>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            required
                        />
                    </div>

                    {/* Enlace Olvidó Contraseña */}
                    <div className="forgot-wrapper">
                        <a href="#forgot" onClick={handleForgotPassword} className="forgot-link">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Botón Principal */}
                    <button
                        type="submit"
                        className="btn-signin"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login