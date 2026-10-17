package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

import java.time.LocalDate;

public class AsistenciaResponseDTO {


        private Long id;
        private String nombreEstudiante;
        private String matricula;
        private LocalDate fecha;
        private EstadoAsistencias estado;
        private String observacion;
    private Long estudianteId;
    private String hora;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreEstudiante() {
        return nombreEstudiante;
    }

    public void setNombreEstudiante(String nombreEstudiante) {
        this.nombreEstudiante = nombreEstudiante;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
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

    public Long getEstudianteId() {
        return estudianteId;
    }

    public void setEstudianteId(Long estudianteId) {
        this.estudianteId = estudianteId;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }
}
