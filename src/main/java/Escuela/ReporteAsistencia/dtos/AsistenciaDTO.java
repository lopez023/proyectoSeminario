package Escuela.ReporteAsistencia.dtos;

import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

public class AsistenciaDTO {

    private Long estudianteId;

    // Puedes usar el Enum directamente; Spring Boot lo mapea automáticamente
    // si el texto que envía el frontend coincide con los nombres del Enum (ej. "PRESENTE", "AUSENTE")
    private EstadoAsistencias estado;

    private String comentario;

    // Constructor vacío (obligatorio para que Jackson/Spring Boot pueda convertir el JSON a objeto)
    public AsistenciaDTO() {}

    public Long getEstudianteId() {
        return estudianteId;
    }

    public void setEstudianteId(Long estudianteId) {
        this.estudianteId = estudianteId;
    }

    public EstadoAsistencias getEstado() {
        return estado;
    }

    public void setEstado(EstadoAsistencias estado) {
        this.estado = estado;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
