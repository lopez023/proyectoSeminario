package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.interfaceModels.SeccionProjection;
import Escuela.ReporteAsistencia.models.Secciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

}
