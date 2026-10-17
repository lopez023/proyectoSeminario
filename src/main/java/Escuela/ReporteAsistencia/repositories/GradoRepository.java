package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.models.Grados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GradoRepository extends JpaRepository<Grados,Long> {

}
