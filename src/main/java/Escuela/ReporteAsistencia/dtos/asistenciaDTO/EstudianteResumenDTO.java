package Escuela.ReporteAsistencia.dtos.asistenciaDTO;


import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

public record EstudianteResumenDTO(
        Long id,
        String nombreCompleto,
        String gradoNombre,
        String seccionNombre,
        EstadoAsistencias estadoAsistenciaHoy // PRESENTE, AUSENTE, TARDE, JUSTIFICADO o null
) {}