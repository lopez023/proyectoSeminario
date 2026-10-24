package Escuela.ReporteAsistencia.dtos.asistenciaDTO;


import Escuela.ReporteAsistencia.enums.EstadoAsistencias;

import java.time.LocalTime;

public record UltimaAsistenciaDTO(
        Long id,
        String nombreAlumno,
        String gradoNombre,
        String seccionNombre,
        EstadoAsistencias estado,
        LocalTime hora
) {}