package Escuela.ReporteAsistencia.repositories;

import Escuela.ReporteAsistencia.models.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuarios, Long> {

    Optional<Usuarios> findByUsername(String username);

    @Query("SELECT u FROM Usuarios u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<Usuarios> findByUsernameWithRoles(@Param("username") String username);
}
