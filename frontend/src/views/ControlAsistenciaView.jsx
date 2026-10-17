import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './ControlAsistenciaView.css'

function ControlAsistenciaView() {
    const [gradoSeccion, setGradoSeccion] = useState('3.° Primaria - Sección A')
    const [tipoReporte, setTipoReporte] = useState('semanal') // 'semanal' o 'mensual'

    // Datos simulados de asistencia
    const [asistenciasData] = useState([
        { id: 1, alumno: 'Juan Pérez', lunes: 'Presente', martes: 'Presente', miercoles: 'Tardanza', jueves: 'Presente', viernes: 'Presente', porcentaje: '96%' },
        { id: 2, alumno: 'María López', lunes: 'Presente', martes: 'Presente', miercoles: 'Presente', jueves: 'Ausente', viernes: 'Presente', porcentaje: '80%' },
        { id: 3, alumno: 'Carlos García', lunes: 'Ausente', martes: 'Presente', miercoles: 'Presente', jueves: 'Presente', viernes: 'Presente', porcentaje: '80%' },
        { id: 4, alumno: 'Ana Morales', lunes: 'Presente', martes: 'Tardanza', miercoles: 'Presente', jueves: 'Presente', viernes: 'Ausente', porcentaje: '80%' }
    ])

    // FUNCIÓN PARA EXPORTAR ASISTENCIA A PDF
    const exportarAsistenciaPDF = () => {
        const doc = new jsPDF()

        // Encabezado
        doc.setFontSize(18)
        doc.setTextColor(30, 41, 59)
        doc.text('Colegio Mi Escuela', 14, 20)

        doc.setFontSize(13)
        doc.setTextColor(100, 116, 139)
        doc.text(`Reporte de Asistencia (${tipoReporte.toUpperCase()})`, 14, 28)

        doc.setFontSize(10)
        doc.text(`Grado y Sección: ${gradoSeccion}`, 14, 35)
        doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, 14, 41)

        // Configuración de tabla según el tipo de reporte
        let tableColumn = []
        let tableRows = []

        if (tipoReporte === 'semanal') {
            tableColumn = ["#", "Estudiante", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Asistencia %"]
            tableRows = asistenciasData.map((item) => [
                item.id,
                item.alumno,
                item.lunes,
                item.martes,
                item.miercoles,
                item.jueves,
                item.viernes,
                item.porcentaje
            ])
        } else {
            tableColumn = ["#", "Estudiante", "Días Asistidos", "Días Ausentes", "Tardanzas", "% Asistencia Mensual"]
            tableRows = asistenciasData.map((item) => [
                item.id,
                item.alumno,
                "18 días",
                "2 días",
                "1 tardanza",
                item.porcentaje
            ])
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 48,
            theme: 'grid',
            headStyles: { fillColor: [29, 78, 216], textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 4 }
        })

        const nombreArchivo = `Asistencia_${gradoSeccion.replace(/[^a-zA-Z0-9]/g, '_')}_${tipoReporte}.pdf`
        doc.save(nombreArchivo)
    }

    return (
        <div className="asistencia-layout">
            {/* Cabecera */}
            <div className="asistencia-header">
                <div>
                    <h2>✅ Control General de Asistencia</h2>
                    <p>Monitoreo de asistencia escolar por grado, sección y periodos</p>
                </div>
            </div>

            {/* Filtros de Grado/Sección y Periodo */}
            <div className="filtros-container">
                <div className="filtro-grupo">
                    <label>Seleccionar Grado y Sección:</label>
                    <select value={gradoSeccion} onChange={(e) => setGradoSeccion(e.target.value)}>
                        <option value="3.° Primaria - Sección A">3.° Primaria - Sección A</option>
                        <option value="3.° Primaria - Sección B">3.° Primaria - Sección B</option>
                        <option value="2.° Primaria - Sección A">2.° Primaria - Sección A</option>
                        <option value="1.° Primaria - Sección A">1.° Primaria - Sección A</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Tipo de Vista / Periodo:</label>
                    <select value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
                        <option value="semanal">Semanal (Día a Día)</option>
                        <option value="mensual">Mensual (Consolidado)</option>
                    </select>
                </div>
            </div>

            {/* Tabla de Asistencia */}
            <div className="asistencia-card">
                <div className="asistencia-card-header">
                    <h3>Registro de Asistencia - {gradoSeccion} ({tipoReporte.toUpperCase()})</h3>
                    <button className="btn-exportar-asistencia-pdf" onClick={exportarAsistenciaPDF}>
                        📄 Exportar Reporte a PDF
                    </button>
                </div>

                <table className="data-table">
                    <thead>
                    {tipoReporte === 'semanal' ? (
                        <tr>
                            <th>#</th>
                            <th>Estudiante</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miércoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                            <th>% Asistencia</th>
                        </tr>
                    ) : (
                        <tr>
                            <th>#</th>
                            <th>Estudiante</th>
                            <th>Días Asistidos</th>
                            <th>Días Ausentes</th>
                            <th>Tardanzas</th>
                            <th>% Mensual</th>
                        </tr>
                    )}
                    </thead>
                    <tbody>
                    {asistenciasData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.alumno}</strong></td>

                            {tipoReporte === 'semanal' ? (
                                <>
                                    <td><span className={`status ${item.lunes.toLowerCase()}`}>{item.lunes}</span></td>
                                    <td><span className={`status ${item.martes.toLowerCase()}`}>{item.martes}</span></td>
                                    <td><span className={`status ${item.miercoles.toLowerCase()}`}>{item.miercoles}</span></td>
                                    <td><span className={`status ${item.jueves.toLowerCase()}`}>{item.jueves}</span></td>
                                    <td><span className={`status ${item.viernes.toLowerCase()}`}>{item.viernes}</span></td>
                                </>
                            ) : (
                                <>
                                    <td>18 días</td>
                                    <td>2 días</td>
                                    <td><span className="status late">1 tardanza</span></td>
                                </>
                            )}

                            <td><strong>{item.porcentaje}</strong></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ControlAsistenciaView