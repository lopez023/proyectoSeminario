/*package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.AsistenciaDTO;
import Escuela.ReporteAsistencia.enums.EstadoAsistencias;
import Escuela.ReporteAsistencia.interfaceModels.AsistenciaService;
import Escuela.ReporteAsistencia.models.Asistencias;
import Escuela.ReporteAsistencia.models.Estudiantes;
import Escuela.ReporteAsistencia.repositories.AsistenciaRepository;
import Escuela.ReporteAsistencia.repositories.EstudianteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Service
public class AsistenciaServiceImp implements AsistenciaService {



    @Autowired
    private AsistenciaRepository asistenciasRepository;

    @Autowired
    private EstudianteRepository estudiantesRepository;

    @Transactional
    public void registrarAsistenciaMasiva(List<AsistenciaDTO> dtos) {
        LocalDate hoy = LocalDate.now();

        for (AsistenciaDTO dto : dtos) {
            Estudiantes estudiante = estudiantesRepository.findById(dto.getEstudianteId())
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            // OPCIONAL: Validar si ya existe asistencia registrada hoy para este estudiante
            boolean yaRegistrado = asistenciasRepository.existsByEstudianteAndFecha(estudiante, hoy);

            Asistencias asistencia;
            if (yaRegistrado) {
                // Opcional A: Si ya existe, puedes actualizar su estado en lugar de duplicar
                // asistencia = asistenciasRepository.findByEstudianteAndFecha(estudiante, hoy);

                // Opcional B: O simplemente saltarlo o lanzar una excepción
                continue;
            } else {
                // Si no existe, creamos uno nuevo
                asistencia = new Asistencias();
                asistencia.setEstudiante(estudiante);
                asistencia.setFecha(hoy);
            }

            asistencia.setHora(LocalTime.now());
            asistencia.setEstado(dto.getEstado());
            asistencia.setComentario(dto.getComentario());

            asistenciasRepository.save(asistencia);
        }
    }

    // Obtener reporte semanal (ej. pasando la fecha de inicio de la semana)
    public List<Asistencias> obtenerReporteSemanal(Long seccionId, LocalDate inicioSemana) {
        LocalDate finSemana = inicioSemana.plusDays(6); // Lunes a Domingo
        return asistenciasRepository.findBySeccionAndRangoFechas(seccionId, inicioSemana, finSemana);
    }

    // Obtener reporte mensual (ej. Año y Mes)
    public List<Asistencias> obtenerReporteMensual(Long seccionId, int anio, int mes) {
        LocalDate inicioMes = LocalDate.of(anio, mes, 1);
        LocalDate finMes = inicioMes.withDayOfMonth(inicioMes.lengthOfMonth());
        return asistenciasRepository.findBySeccionAndRangoFechas(seccionId, inicioMes, finMes);
    }

}
*/