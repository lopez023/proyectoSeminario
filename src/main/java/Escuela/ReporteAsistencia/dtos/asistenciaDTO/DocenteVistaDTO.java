package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import java.util.List;

public record DocenteVistaDTO(
        Long id,
        String nombreCompleto,
        String gradoNombre,
        String seccionNombre,
        List<EstudianteResumenDTO> estudiantes
) {}
