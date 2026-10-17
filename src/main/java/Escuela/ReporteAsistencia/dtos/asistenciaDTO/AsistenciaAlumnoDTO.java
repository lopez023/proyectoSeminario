package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

public record AsistenciaAlumnoDTO(
        Long id,
        String nombre,
        String estado,
        String hora,
        String observacion
) {}
