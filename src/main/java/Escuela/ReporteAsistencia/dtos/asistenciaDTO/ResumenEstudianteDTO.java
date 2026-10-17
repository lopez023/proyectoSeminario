package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

public record ResumenEstudianteDTO(
        Long estudianteId,
        String nombre, String matricula,
        long presentes,
        long tardes,
        long ausentes,
        long justificados,
        long total,
        double porcentaje) {}
