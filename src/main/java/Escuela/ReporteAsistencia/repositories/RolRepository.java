package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;


@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByRol(String rol);

    Set<Rol> findByRolIn(Set<String> nombresRoles);
}
