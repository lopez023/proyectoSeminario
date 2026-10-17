package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.UsuarioDTO;
import Escuela.ReporteAsistencia.interfaceModels.UsuariosService;
import Escuela.ReporteAsistencia.mappers.UsuarioMapper;
import Escuela.ReporteAsistencia.models.Estudiantes;
import Escuela.ReporteAsistencia.models.PerfilDocente;
import Escuela.ReporteAsistencia.models.Rol;
import Escuela.ReporteAsistencia.models.Usuarios;
import Escuela.ReporteAsistencia.repositories.RolRepository;
import Escuela.ReporteAsistencia.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
@Service
public class UsuarioServiceImp implements UsuariosService {

    @Autowired
    private UsuarioRepository usuariosRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    @Transactional
    public UsuarioDTO crear(UsuarioDTO dto) {

        // 1. Mapear (id, perfil, roles, contrasenia, fechaCreacion ya vienen ignorados)
        Usuarios usuario = mapper.toEntity(dto);

        // 2. Fecha de creación
        usuario.setFechaCreacion(LocalDate.now());

        // 3. Contraseña encriptada
        if (dto.getContrasenia() == null || dto.getContrasenia().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }
        usuario.setContrasenia(passwordEncoder.encode(dto.getContrasenia()));

        // 4. Roles
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Rol> rolesEncontrados = rolRepository.findByRolIn(dto.getRoles());

            if (rolesEncontrados.size() != dto.getRoles().size()) {
                throw new RuntimeException("Uno o más roles no existen");
            }
            usuario.setRoles(rolesEncontrados);
        } else {
            Rol rolPorDefecto = rolRepository.findByRol("USUARIO")
                    .orElseThrow(() -> new RuntimeException("Rol por defecto no configurado"));
            usuario.setRoles(Set.of(rolPorDefecto));
        }

        // 5. Guardar y devolver (toDto ya ignora la contraseña)
        Usuarios guardado = usuariosRepository.save(usuario);
        return mapper.toDto(guardado);
    }

    // READ (Todos)
    public List<UsuarioDTO> listar() {
        return mapper.toDtoList(usuariosRepository.findAll());
    }

    // READ (Uno por ID)
    public UsuarioDTO obtenerPorId(Long id) {
        Usuarios usuario = usuariosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return mapper.toDto(usuario);
    }

    // UPDATE
    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioDTO dto) {
        Usuarios usuario = usuariosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Actualiza campos básicos
        mapper.updateEntityFromDto(dto, usuario);

        // Si se envía una nueva contraseña, la encriptamos y actualizamos
        if (dto.getContrasenia() != null && !dto.getContrasenia().isEmpty()) {
            usuario.setContrasenia(passwordEncoder.encode(dto.getContrasenia()));
        }

        // Actualiza los roles por sus nombres si se especifican
        if (dto.getRoles() != null) {
            Set<Rol> rolesEncontrados = rolRepository.findByRolIn(dto.getRoles());
            usuario.setRoles(rolesEncontrados);
        }

        Usuarios actualizado = usuariosRepository.save(usuario);
        return mapper.toDto(actualizado);
    }

    // DELETE
    @Transactional
    public void eliminar(Long id) {
        if (!usuariosRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        usuariosRepository.deleteById(id);
    }


    public String obtenerNombre(String usuario){

        Usuarios usuarios =usuariosRepository.findByUsername(usuario)
                .orElseThrow(()->new RuntimeException("usuario no encontrado con el codigo " + usuario));


        PerfilDocente nombreUsuario = usuarios.getPerfil();

        String nombre = nombreUsuario.getNombre();

        return nombre;

    }

    public UsuarioDTO obtenerPorusuario(String usuario){
        Usuarios usuarios = usuariosRepository.findByUsername(usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuario));
        return mapper.toDto(usuarios);

    }
}
