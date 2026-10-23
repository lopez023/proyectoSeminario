import { useState, useEffect } from 'react'
import './UsuariosView.css'
import { API_BASE_URL } from "../config.jsx";

function UsuariosView() {
    const [modalAbierto, setModalAbierto] = useState(false)

    // Estado para la lista de usuarios cargados desde la API
    const [usuarios, setUsuarios] = useState([])

    // Estado para los roles que vienen de la base de datos (GET /api/roles)
    const [rolesDisponibles, setRolesDisponibles] = useState([])

    // Estado para el formulario basado estrictamente en el JSON del DTO
    const [nuevoUsuario, setNuevoUsuario] = useState({
        username: '',
        contrasenia: '',
        email: '',
        estado: true,
        roles: []
    })

    // Cargar usuarios y roles desde el backend al montar el componente
    useEffect(() => {
        cargarUsuarios()
        cargarRoles()
    }, [])

    // 1. Obtener listado de usuarios con autenticación JWT
    const cargarUsuarios = async () => {
        const token = localStorage.getItem('jwt_token')



        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setUsuarios(data)
            } else {
                console.error('Error al obtener usuarios. Código:', response.status)
            }
        } catch (error) {
            console.error('Error de red al conectar con GET /api/usuarios:', error)
        }
    }

    // 2. Obtener roles desde la base de datos (GET /api/roles) con JWT
    const cargarRoles = async () => {
        const token = localStorage.getItem('jwt_token')
        try {
            const response = await fetch(`${API_BASE_URL}/api/roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setRolesDisponibles(data) // Estructura: [{id: 1, rol: 'administrador'}, ...]
                if (data.length > 0) {
                    setNuevoUsuario(prev => ({ ...prev, roles: [data[0].rol] }))
                }
            } else {
                console.error('Error al obtener los roles. Código:', response.status)
            }
        } catch (error) {
            console.error('Error de red al conectar con GET /api/roles:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setNuevoUsuario({
            ...nuevoUsuario,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleRolChange = (e) => {
        // Almacenamos el rol seleccionado dentro de un arreglo de strings
        setNuevoUsuario({
            ...nuevoUsuario,
            roles: [e.target.value]
        })
    }

    // 3. Método POST para registrar el usuario enviando el JSON al backend con JWT
    const handleSubmitUsuario = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('jwt_token')
        if (!token) {
            alert('No se encontró una sesión activa. Por favor, inicia sesión nuevamente.')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nuevoUsuario)
            })

            if (response.ok) {
                alert('¡Usuario registrado exitosamente en el backend!')
                setModalAbierto(false)
                // Limpiar formulario y mantener un rol por defecto
                setNuevoUsuario({
                    username: '',
                    contrasenia: '',
                    email: '',
                    estado: true,
                    roles: rolesDisponibles.length > 0 ? [rolesDisponibles[0].rol] : []
                })
                cargarUsuarios() // Recargar la tabla con los nuevos datos
            } else if (response.status === 401 || response.status === 403) {
                alert('Acceso no autorizado. Verifica tus permisos de administrador o vuelve a iniciar sesión.')
            } else {
                const errorText = await response.text()
                console.error('Detalle del error:', errorText)
                alert('Error al registrar el usuario en el servidor.')
            }
        } catch (error) {
            console.error('Error de red al enviar el POST:', error)
            alert('No se pudo conectar con el servidor backend en localhost:8080')
        }
    }

    return (
        <div className="usuarios-layout">
            {/* Cabecera */}
            <div className="usuarios-header">
                <div>
                    <h2>⚙️ Gestión de Usuarios del Sistema</h2>
                    <p>Conectado con Spring Boot (API REST & JWT)</p>
                </div>
                <button className="btn-nuevo-usuario" onClick={() => setModalAbierto(true)}>
                    ➕ Registrar Nuevo Usuario
                </button>
            </div>

            {/* Tabla de Usuarios */}
            <div className="usuarios-card">
                <h3>Listado de Usuarios Registrados</h3>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th># ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Roles</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.length > 0 ? (
                        usuarios.map((user) => (
                            <tr key={user.id || Math.random()}>
                                <td>{user.id || 'N/A'}</td>
                                <td><strong>{user.username}</strong></td>
                                <td>{user.email}</td>
                                <td>
                    <span className={`status ${user.estado ? 'present' : 'absent'}`}>
                      {user.estado ? 'Activo' : 'Inactivo'}
                    </span>
                                </td>
                                <td>
                                    {Array.isArray(user.roles) && user.roles.map((r, i) => (
                                        <span key={i} className="role-badge">{r}</span>
                                    ))}
                                </td>
                                <td>
                                    <button className="accion-link">Editar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                                No hay usuarios registrados o no se pudieron cargar desde el servidor.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal para Registrar Nuevo Usuario con datos de la API */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Registrar Nuevo Usuario</h3>
                        <form onSubmit={handleSubmitUsuario}>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={nuevoUsuario.username}
                                onChange={handleInputChange}
                                placeholder="Ej. jandrade"
                                required
                            />

                            <label>Contraseña (Escritura protegida - WRITE_ONLY):</label>
                            <input
                                type="password"
                                name="contrasenia"
                                value={nuevoUsuario.contrasenia}
                                onChange={handleInputChange}
                                placeholder="********"
                                required
                            />

                            <label>Correo Electrónico (Email):</label>
                            <input
                                type="email"
                                name="email"
                                value={nuevoUsuario.email}
                                onChange={handleInputChange}
                                placeholder="usuario@miescuela.com"
                                required
                            />

                            <label>Rol (Obtenido de Base de Datos - api/roles):</label>
                            <select
                                value={nuevoUsuario.roles[0] || ''}
                                onChange={handleRolChange}
                                required
                            >
                                {rolesDisponibles.map((item) => (
                                    <option key={item.id} value={item.rol}>
                                        {item.rol.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="estado"
                                    id="estadoCheck"
                                    checked={nuevoUsuario.estado}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="estadoCheck">Usuario Activo</label>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-guardar">Guardar en Base de Datos</button>
                                <button type="button" className="btn-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsuariosView