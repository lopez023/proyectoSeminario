package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.dtos.asistenciaDTO.UltimaAsistenciaDTO;
import Escuela.ReporteAsistencia.enums.EstadoAsistencias;
import Escuela.ReporteAsistencia.models.Asistencias;
import Escuela.ReporteAsistencia.models.Estudiantes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
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



    long countByFechaAndEstado(LocalDate fecha, EstadoAsistencias estado);

    @Query("""
    SELECT new Escuela.ReporteAsistencia.dtos.asistenciaDTO.UltimaAsistenciaDTO(
        a.id,
        CONCAT(e.nombre, ' ', e.primerApellido),
        g.nombreGrado,
        s.nombre,
        a.estado,
        a.hora
    )
    FROM Asistencias a
    JOIN a.estudiante e
    JOIN e.seccion s
    JOIN s.grado g
    WHERE a.fecha = :fecha
    ORDER BY a.hora DESC, a.id DESC
    LIMIT 5
""")
    List<UltimaAsistenciaDTO> obtenerUltimasAsistenciasDelDia(@Param("fecha") LocalDate fecha);

}

