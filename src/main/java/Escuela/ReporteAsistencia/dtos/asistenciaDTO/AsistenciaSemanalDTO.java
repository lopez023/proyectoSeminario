package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

import java.time.LocalDate;
import java.util.Map;

public class AsistenciaSemanalDTO {
    private Long estudianteId;
    private String nombreEstudiante;
    private LocalDate inicio;
    private LocalDate fin;
    private Map<LocalDate, EstadoAsistencias> detallePorDia;
    private double porcentaje;

    public Long getEstudianteId() {
        return estudianteId;
    }

    public void setEstudianteId(Long estudianteId) {
        this.estudianteId = estudianteId;
    }

    public String getNombreEstudiante() {
        return nombreEstudiante;
    }

    public void setNombreEstudiante(String nombreEstudiante) {
        this.nombreEstudiante = nombreEstudiante;
    }

    public LocalDate getInicio() {
        return inicio;
    }

    public void setInicio(LocalDate inicio) {
        this.inicio = inicio;
    }

    public LocalDate getFin() {
        return fin;
    }

    public void setFin(LocalDate fin) {
        this.fin = fin;
    }

    public Map<LocalDate, EstadoAsistencias> getDetallePorDia() {
        return detallePorDia;
    }

    public void setDetallePorDia(Map<LocalDate, EstadoAsistencias> detallePorDia) {
        this.detallePorDia = detallePorDia;
    }

    public double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(double porcentaje) {
        this.porcentaje = porcentaje;
    }
}
