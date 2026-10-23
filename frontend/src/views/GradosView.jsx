import { useState, useEffect } from 'react'
import './GradosView.css'
import { API_BASE_URL } from "../config.jsx"

function GradosView() {
    const [gradosData, setGradosData] = useState([])
    const [gradosListRaw, setGradosListRaw] = useState([])
    const [docentesList, setDocentesList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Estados para el Modal y el Formulario
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        gradoId: '',
        nombre: '',
        cupoMaximo: 30,
        docenteId: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            // Obtener grados, secciones y docentes en paralelo
            const [resGrados, resSecciones, resDocentes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/grado`, { headers }),
                fetch(`${API_BASE_URL}/api/secciones`, { headers }),
                fetch(`${API_BASE_URL}/api/docentes`, { headers }).catch(() => ({ ok: false }))
            ])

            if (!resGrados.ok || !resSecciones.ok) {
                throw new Error('Error al cargar la información académica')
            }

            const grados = await resGrados.json()
            const seccionesList = await resSecciones.json()
            let docentes = []
            if (resDocentes.ok) {
                docentes = await resDocentes.json()
            }

            setGradosListRaw(grados)
            setDocentesList(docentes)

            // Vincular secciones a su respectivo grado
            const gradosConSecciones = grados.map(grado => ({
                ...grado,
                secciones: seccionesList.filter(sec => sec.gradoId === grado.id)
            }))

            setGradosData(gradosConSecciones)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmitSeccion = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const token = localStorage.getItem('jwt_token')
            const response = await fetch(`${API_BASE_URL}/api/secciones`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gradoId: Number(formData.gradoId),
                    nombre: formData.nombre,
                    cupoMaximo: Number(formData.cupoMaximo),
                    docenteId: formData.docenteId ? Number(formData.docenteId) : null
                })
            })

            if (!response.ok) {
                throw new Error('Error al registrar la sección')
            }

            // Cerrar modal, limpiar formulario y recargar datos de forma dinámica
            setShowModal(false)
            setFormData({ gradoId: '', nombre: '', cupoMaximo: 30, docenteId: '' })
            await fetchData()
        } catch (err) {
            alert('⚠️ ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="loading-state">Cargando grados y secciones...</div>
    if (error) return <div className="error-state">⚠️ {error}</div>

    return (
        <div className="grados-layout">
            <div className="grados-header">
                <div>
                    <h2>📚 Grados y Secciones Académicas</h2>
                    <p>Distribución de secciones y docentes asignados por grado</p>
                </div>
                {/* ➕ Abre el modal para crear la sección */}
                <button className="btn-nuevo-grado" onClick={() => setShowModal(true)}>
                    ➕ Asignar Grado / Sección
                </button>
            </div>

            {/* MODAL PARA CREAR NUEVA SECCIÓN */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Asignar Nueva Sección</h3>
                        <form onSubmit={handleSubmitSeccion} className="modal-form">
                            <div className="modal-group">
                                <label>Grado:</label>
                                <select
                                    name="gradoId"
                                    value={formData.gradoId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un grado</option>
                                    {gradosListRaw.map(g => (
                                        <option key={g.id} value={g.id}>{g.nombreGrado}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-group">
                                <label>Nombre de Sección (Ej: A, B):</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej. A"
                                    required
                                />
                            </div>

                            <div className="modal-group">
                                <label>Cupo Máximo:</label>
                                <input
                                    type="number"
                                    name="cupoMaximo"
                                    value={formData.cupoMaximo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="modal-group">
                                <label>Docente Encargado (Opcional):</label>
                                <select
                                    name="docenteId"
                                    value={formData.docenteId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Sin asignar</option>
                                    {docentesList.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.nombre} {doc.primerApellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-buttons">
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-guardar"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Guardando...' : 'Guardar Sección'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grados-grid">
                {gradosData.map((item) => (
                    <div key={item.id} className="grado-card">
                        <div className="grado-card-header">
                            <h3>{item.nombreGrado}</h3>
                            <span className="grado-desc">{item.description || ''}</span>
                        </div>

                        <div className="secciones-container">
                            {item.secciones && item.secciones.length > 0 ? (
                                item.secciones.map((sec) => (
                                    <div key={sec.id} className="seccion-item">
                                        <div className="seccion-badge-info">
                                            <span className="badge-seccion">Sección {sec.nombre}</span>
                                            <span className="alumnos-count">👥 {sec.estudiantesCount || 0} alumnos</span>
                                        </div>

                                        <div className="profesor-asignado-box">
                                            <small>Profesor encargado:</small>
                                            <p className="profesor-nombre">👨‍🏫 {sec.nombreDocente || 'Sin asignar'}</p>
                                            <span className={`estado-prof ${sec.nombreDocente ? 'activo' : 'pendiente'}`}>
                                                ● {sec.nombreDocente ? 'Activo' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No hay secciones registradas para este grado.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GradosView