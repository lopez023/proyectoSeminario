package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.models.PerfilDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PerfilDocenteRepository extends JpaRepository<PerfilDocente, Long> {

    boolean existsByUsuarioId(Long usuarioId);

    Optional<PerfilDocente> findByUsuario_Username(String username);
}
