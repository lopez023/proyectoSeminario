package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

public record EstadoDiarioDTO(
        Long estudianteId,
        String nombre,
        String matricula,
        EstadoAsistencias estado
) {
}
