package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.enums.EstadoAsistencias;
import Escuela.ReporteAsistencia.models.Asistencias;
import Escuela.ReporteAsistencia.models.Estudiantes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencias,Long> {

    List<Asistencias> findByEstudianteIdAndFechaBetweenOrderByFechaAsc(
            Long estudianteId, LocalDate inicio, LocalDate fin);

    List<Asistencias> findByFechaOrderByEstudiante_PrimerApellidoAsc(LocalDate fecha);


    List<Asistencias> findByFechaBetween(LocalDate inicio, LocalDate fin);

    long countByEstudianteIdAndFechaBetween(
            Long estudianteId, LocalDate inicio, LocalDate fin);

    long countByEstudianteIdAndFechaBetweenAndEstado(
            Long estudianteId, LocalDate inicio, LocalDate fin, EstadoAsistencias estado);

    Optional<Asistencias> findByEstudianteIdAndFecha(Long estudianteId, LocalDate fecha);

    List<Asistencias> findByFechaAndEstudiante_IdIn(
            LocalDate fecha,
            Collection<Long> estudianteIds
    );

}

