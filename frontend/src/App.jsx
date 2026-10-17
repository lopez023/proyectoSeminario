import { useState } from 'react'
import Login from './components/Login'
import MainLayout from './components/MainLayout' // Tu layout de administrador actual
import PortalDocenteView from './views/Docente/PortalDocenteView'
// Importa también la vista del profesor si ya la creaste:
// import PortalProfesorView from './views/PortalProfesorView'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'))
  const [role, setRole] = useState(localStorage.getItem('user_role'))

  const handleLoginSuccess = (newToken, newRole) => {
    setToken(newToken)
    setRole(newRole)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_role')
    setToken(null)
    setRole(null)
  }

  // Si no ha iniciado sesión, mostrar Login
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Si es Administrador, mostramos su layout/dashboard completo
  if (role === 'ADMIN' || role === 'ROLE_ADMINISTRADOR') {
    return <MainLayout onLogout={handleLogout} />
  }

  // Si es Profesor, mostramos su portal correspondiente
  if (role === 'PROFESOR' || role === 'ROLE_DOCENTE') {
      return <PortalDocenteView onLogout={handleLogout} />
  }

  // Por seguridad, si hay token pero el rol no es válido
  return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Rol no autorizado o desconocido</h2>
        <button onClick={handleLogout}>Volver al Login</button>
      </div>
  )
}

export default App