package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import java.time.LocalDate;
import java.util.List;

public record ListaAsistenciaDTO(
        LocalDate fecha,
        Long seccionId,
        String seccion,
        Long gradoId,
        String grado,
        List<AsistenciaAlumnoDTO> alumnos
) {
}
