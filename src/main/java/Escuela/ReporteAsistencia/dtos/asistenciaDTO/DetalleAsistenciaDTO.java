package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

public class DetalleAsistenciaDTO {
    private Long estudianteId;
    private EstadoAsistencias estado;
    private String observacion;

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

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}
