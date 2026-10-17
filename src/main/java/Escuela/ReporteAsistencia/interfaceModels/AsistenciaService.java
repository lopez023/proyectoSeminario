package Escuela.ReporteAsistencia.interfaceModels;

import Escuela.ReporteAsistencia.dtos.AsistenciaDTO;
import Escuela.ReporteAsistencia.models.Asistencias;

import java.time.LocalDate;
import java.util.List;


public interface AsistenciaService {

    public void registrarAsistenciaMasiva(List<AsistenciaDTO> dtos);


    // Obtener reporte semanal (ej. pasando la fecha de inicio de la semana)
    public List<Asistencias> obtenerReporteSemanal(Long seccionId, LocalDate inicioSemana);

    // Obtener reporte mensual (ej. Año y Mes)
    public List<Asistencias> obtenerReporteMensual(Long seccionId, int anio, int mes);
}
