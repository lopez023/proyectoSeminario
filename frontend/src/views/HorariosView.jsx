import { useState } from 'react'
import './HorariosView.css'

function HorariosView() {
    const [gradoSeleccionado, setGradoSeleccionado] = useState('3.° Primaria - Sección A')

    // Horario semanal de ejemplo
    const horarioData = [
        { hora: '08:00 AM - 08:45 AM', lunes: 'Matemáticas', martes: 'Comunicación', miercoles: 'Matemáticas', jueves: 'Ciencias Naturales', viernes: 'Educación Física' },
        { hora: '08:45 AM - 09:30 AM', lunes: 'Matemáticas', martes: 'Comunicación', miercoles: 'Matemáticas', jueves: 'Ciencias Naturales', viernes: 'Educación Física' },
        { hora: '09:30 AM - 10:00 AM', lunes: 'RECREO', martes: 'RECREO', miercoles: 'RECREO', jueves: 'RECREO', viernes: 'RECREO' },
        { hora: '10:00 AM - 10:45 AM', lunes: 'Estudios Sociales', martes: 'Inglés', miercoles: 'Computación', jueves: 'Arte', viernes: 'Música' },
        { hora: '10:45 AM - 11:30 AM', lunes: 'Estudios Sociales', martes: 'Inglés', miercoles: 'Computación', jueves: 'Arte', viernes: 'Música' }
    ]

    return (
        <div className="horarios-layout">
            {/* 1. Cabecera y Selector de Grados */}
            <div className="horarios-header">
                <div>
                    <h2>⏰ Horarios de Clases</h2>
                    <p>Consulta y gestión de la malla curricular semanal por sección</p>
                </div>
                <div className="selector-grado-container">
                    <label>Filtrar Sección:</label>
                    <select
                        value={gradoSeleccionado}
                        onChange={(e) => setGradoSeleccionado(e.target.value)}
                        className="select-grado"
                    >
                        <option value="3.° Primaria - Sección A">3.° Primaria - Sección A</option>
                        <option value="3.° Primaria - Sección B">3.° Primaria - Sección B</option>
                        <option value="2.° Primaria - Sección A">2.° Primaria - Sección A</option>
                        <option value="1.° Primaria - Sección A">1.° Primaria - Sección A</option>
                    </select>
                </div>
            </div>

            {/* 2. Tabla de Horario Semanal */}
            <div className="horarios-card">
                <div className="horarios-table-header">
                    <h3>Malla Horaria Semanal</h3>
                    <span className="badge-seccion-activa">Mostrando: {gradoSeleccionado}</span>
                </div>

                <div className="table-responsive">
                    <table className="horarios-table">
                        <thead>
                        <tr>
                            <th>Hora / Jornada</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miércoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {horarioData.map((fila, index) => (
                            <tr key={index} className={fila.lunes === 'RECREO' ? 'fila-recreo' : ''}>
                                <td className="hora-columna"><strong>{fila.hora}</strong></td>
                                <td>{fila.lunes}</td>
                                <td>{fila.martes}</td>
                                <td>{fila.miercoles}</td>
                                <td>{fila.jueves}</td>
                                <td>{fila.viernes}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default HorariosView