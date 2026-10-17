package Escuela.ReporteAsistencia.interfaceModels;


import Escuela.ReporteAsistencia.enums.EstadoAsistencias;
import Escuela.ReporteAsistencia.models.Asistencias;

import java.time.LocalDate;
import java.util.List;

public interface EstadoAsistenciaService {

    //@Transactional
    public Asistencias registrarAsistencia(Long estudianteId, LocalDate fecha, EstadoAsistencias estado);

    public List<Asistencias> listarPorEstudiante(Long estudianteId);

}
