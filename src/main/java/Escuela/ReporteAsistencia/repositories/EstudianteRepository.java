package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.dtos.EstudianteDTO;
import Escuela.ReporteAsistencia.models.Estudiantes;
import Escuela.ReporteAsistencia.models.Secciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface EstudianteRepository extends JpaRepository <Estudiantes,Long> {

    Optional<Secciones> findByNombre(String nombre);

    Optional<Estudiantes>  findByCodigoEstudiante(String codigo);

    List<Estudiantes> findBySeccion_IdOrderByIdAsc(Long seccionId);
}
