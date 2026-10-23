import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './JustificacionesView.css'

function JustificacionesView() {
    const [modalAbierto, setModalAbierto] = useState(false)

    const [nuevaJustificacion, setNuevaJustificacion] = useState({
        alumno: '',
        gradoSeccion: '3.° Primaria - Sección A',
        fechaInasistencia: '',
        motivo: '',
        estado: 'Pendiente'
    })

    const [justificaciones, setJustificaciones] = useState([
        {
            id: 1,
            alumno: 'Carlos García',
            grado: 'Comunion y Confirmacion',
            seccion: 'A',
            fechaInasistencia: '2026-10-12',
            motivo: 'Cita médica documentada con constancia adjunta del pediatra.',
            estado: 'Aprobada'
        },
        {
            id: 2,
            alumno: 'Ana Morales',
            grado: 'Comunion y Confirmacion',
            seccion: 'B',
            fechaInasistencia: '2026-10-14',
            motivo: 'Motivos familiares de fuerza mayor.',
            estado: 'Pendiente'
        }
    ])

    // FUNCIÓN PARA GENERAR EL PDF INDIVIDUAL DE UN ESTUDIANTE
    const exportarPDFIndividual = (item) => {
        const doc = new jsPDF()

        // 1. Encabezado Institucional
        doc.setFontSize(18)
        doc.setTextColor(30, 41, 59)
        doc.text('Colegio Mi Escuela', 14, 20)

        doc.setFontSize(12)
        doc.setTextColor(100, 116, 139)
        doc.text('CONSTANCIA INDIVIDUAL DE JUSTIFICACIÓN DE INASISTENCIA', 14, 28)

        doc.setLineWidth(0.5)
        doc.setDrawColor(203, 213, 225)
        doc.line(14, 32, 196, 32)

        // 2. Información del Estudiante
        doc.setFontSize(11)
        doc.setTextColor(15, 23, 42)
        doc.text(`Estudiante: ${item.alumno}`, 14, 42)
        doc.text(`Grado y Sección: ${item.grado} - Sección ${item.seccion}`, 14, 50)
        doc.text(`Fecha de la Inasistencia: ${item.fechaInasistencia}`, 14, 58)
        doc.text(`Estado del Trámite: ${item.estado}`, 14, 66)

        // 3. Tabla / Cuadro con el Motivo Detallado
        autoTable(doc, {
            startY: 74,
            head: [['Detalle / Motivo de la Inasistencia']],
            body: [[item.motivo]],
            theme: 'grid',
            headStyles: { fillColor: [29, 78, 216], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 6 }
        })

        // 4. Sección de Firmas de Conformidad
        const finalY = doc.lastAutoTable.finalY + 35

        doc.setLineWidth(0.5)
        doc.setDrawColor(100, 116, 139)

        // Firma Padre/Tutor
        doc.line(20, finalY, 80, finalY)
        doc.setFontSize(9)
        doc.text('Firma del Padre / Tutor', 30, finalY + 6)

        // Firma Dirección / Secretaría
        doc.line(130, finalY, 190, finalY)
        doc.text('Sello y Firma Dirección', 140, finalY + 6)

        // 5. Descargar PDF con el nombre del estudiante
        const nombreLimpio = item.alumno.replace(/\s+/g, '_')
        doc.save(`Justificacion_${nombreLimpio}_${item.fechaInasistencia}.pdf`)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNuevaJustificacion({
            ...nuevaJustificacion,
            [name]: value
        })
    }

    const handleSubmitJustificacion = (e) => {
        e.preventDefault()
        const [grado, , seccion] = nuevaJustificacion.gradoSeccion.split(' - ')

        const itemCreado = {
            id: justificaciones.length + 1,
            alumno: nuevaJustificacion.alumno,
            grado: grado,
            seccion: seccion.replace('Sección ', ''),
            fechaInasistencia: nuevaJustificacion.fechaInasistencia,
            motivo: nuevaJustificacion.motivo,
            estado: 'Pendiente'
        }

        setJustificaciones([...justificaciones, itemCreado])
        setModalAbierto(false)
        setNuevaJustificacion({
            alumno: '',
            gradoSeccion: '3.° Primaria - Sección A',
            fechaInasistencia: '',
            motivo: '',
            estado: 'Pendiente'
        })
    }

    return (
        <div className="justificaciones-layout">
            {/* Cabecera */}
            <div className="justificaciones-header">
                <div>
                    <h2>📝 Control de Justificaciones de Inasistencia</h2>
                    <p>Revisión y registro de permisos e inasistencias por estudiante, grado y fecha</p>
                </div>
                <button className="btn-nueva-justificacion" onClick={() => setModalAbierto(true)}>
                    ➕ Registrar Justificación
                </button>
            </div>

            {/* Tabla de Justificaciones */}
            <div className="justificaciones-card">
                <h3>Historial de Inasistencias Justificadas</h3>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th>Grado y Sección</th>
                        <th>Fecha Inasistencia</th>
                        <th>Motivo / Documento</th>
                        <th>Estado</th>
                        <th>Exportar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {justificaciones.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.alumno}</strong></td>
                            <td>
                                <span className="badge-grado-sec">{item.grado} - Sec. {item.seccion}</span>
                            </td>
                            <td>
                                <span className="fecha-badge">📅 {item.fechaInasistencia}</span>
                            </td>
                            <td>{item.motivo}</td>
                            <td>
                  <span className={`status ${item.estado === 'Aprobada' ? 'present' : 'absent'}`}>
                    {item.estado}
                  </span>
                            </td>
                            <td>
                                {/* BOTÓN INDIVIDUAL POR ESTUDIANTE */}
                                <button
                                    className="btn-pdf-tabla"
                                    onClick={() => exportarPDFIndividual(item)}
                                    title="Descargar Ficha PDF para este alumno"
                                >
                                    📄 PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para Registrar Nueva Justificación */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Registrar Justificación de Falta</h3>
                        <form onSubmit={handleSubmitJustificacion}>
                            <label>Nombre del Estudiante:</label>
                            <input
                                type="text"
                                name="alumno"
                                value={nuevaJustificacion.alumno}
                                onChange={handleInputChange}
                                placeholder="Ej. Juan Pérez"
                                required
                            />

                            <label>Grado y Sección:</label>
                            <select
                                name="gradoSeccion"
                                value={nuevaJustificacion.gradoSeccion}
                                onChange={handleInputChange}
                            >
                                <option value="3.° Primaria - Sección A">3.° Primaria - Sección A</option>
                                <option value="3.° Primaria - Sección B">3.° Primaria - Sección B</option>
                                <option value="2.° Primaria - Sección A">2.° Primaria - Sección A</option>
                                <option value="1.° Primaria - Sección A">1.° Primaria - Sección A</option>
                            </select>

                            <label>Fecha de la Inasistencia:</label>
                            <input
                                type="date"
                                name="fechaInasistencia"
                                value={nuevaJustificacion.fechaInasistencia}
                                onChange={handleInputChange}
                                required
                            />

                            <label>Motivo o Descripción:</label>
                            <textarea
                                name="motivo"
                                rows="3"
                                value={nuevaJustificacion.motivo}
                                onChange={handleInputChange}
                                placeholder="Detalle el motivo o constancia..."
                                required
                            ></textarea>

                            <div className="modal-actions">
                                <button type="submit" className="btn-guardar">Guardar Justificación</button>
                                <button type="button" className="btn-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JustificacionesView