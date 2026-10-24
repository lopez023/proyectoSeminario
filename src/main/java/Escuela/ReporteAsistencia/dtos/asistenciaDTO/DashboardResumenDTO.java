package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import java.util.List;

public record DashboardResumenDTO(
        long totalAlumnos,
        long presentesHoy,
        int porcentajePresentes,
        long ausentesHoy,
        int porcentajeAusentes,
        long tardanzasHoy,
        int porcentajeTardanzas,
        List<UltimaAsistenciaDTO> ultimasAsistencias
) {}