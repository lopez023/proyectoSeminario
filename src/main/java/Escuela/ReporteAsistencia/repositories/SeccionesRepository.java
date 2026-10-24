package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.dtos.asistenciaDTO.EstudianteResumenDTO;
import Escuela.ReporteAsistencia.dtos.asistenciaDTO.SeccionesDTO;
import Escuela.ReporteAsistencia.interfaceModels.SeccionProjection;
import Escuela.ReporteAsistencia.models.Secciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SeccionesRepository extends JpaRepository<Secciones, Long> {

    @Query("SELECT DISTINCT s FROM Secciones s " +
            "LEFT JOIN FETCH s.grado " +
            "LEFT JOIN FETCH s.docente " +
            "LEFT JOIN FETCH s.estudiantes")
    List<SeccionProjection> findAllProjections();

    Optional<Secciones> findByNombre(String nombre);

    List<Secciones> findByDocente_Id(Long docenteId);


    @Query("""
        SELECT new Escuela.ReporteAsistencia.dtos.asistenciaDTO.EstudianteResumenDTO(
            e.id,
            CONCAT(e.nombre, ' ', e.primerApellido, ' ', COALESCE(e.segundoApellido, '')),
            g.nombreGrado,
            s.nombre,
            a.estado
        )
        FROM Secciones s
        JOIN s.grado g
        JOIN s.estudiantes e
        LEFT JOIN e.asistencias a ON a.fecha = (
            SELECT MAX(a2.fecha) 
            FROM Asistencias a2 
            WHERE a2.estudiante.id = e.id
        )
        WHERE s.docente.id = :docenteId
        ORDER BY e.primerApellido ASC, e.nombre ASC
    """)
    List<EstudianteResumenDTO> obtenerEstudiantesConUltimaAsistencia(@Param("docenteId") Long docenteId);


    @Query("""
        SELECT new Escuela.ReporteAsistencia.dtos.asistenciaDTO.SeccionesDTO(
            s.id,
            s.nombre,
            s.cupoMaximo,
            g.id,
            g.nombreGrado,
            d.id,
            CASE 
                WHEN d.id IS NOT NULL THEN CONCAT(d.nombre, ' ', COALESCE(d.primerApellido, ''))
                ELSE 'Sin asignar' 
            END,
            COUNT(DISTINCT e.id)
        )
        FROM Secciones s
        JOIN s.grado g
        LEFT JOIN s.docente d
        LEFT JOIN s.estudiantes e
        GROUP BY s.id, s.nombre, s.cupoMaximo, g.id, g.nombreGrado, d.id, d.nombre, d.primerApellido
        ORDER BY g.id ASC, s.nombre ASC
    """)
    List<SeccionesDTO> obtenerSeccionesConConteoEstudiantes();

}
