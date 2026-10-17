package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.PerfilDocenteDTO;
import Escuela.ReporteAsistencia.interfaceModels.PerfilDocenteService;
import Escuela.ReporteAsistencia.mappers.PerfilDocenteMapper;
import Escuela.ReporteAsistencia.models.PerfilDocente;
import Escuela.ReporteAsistencia.models.Rol;
import Escuela.ReporteAsistencia.models.Usuarios;
import Escuela.ReporteAsistencia.repositories.PerfilDocenteRepository;
import Escuela.ReporteAsistencia.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class PerfilDocenteServiceImp implements PerfilDocenteService {
    @Autowired
    private PerfilDocenteRepository docenteRepository;

    @Autowired
    private UsuarioRepository usuariosRepository;

    @Autowired
    private PerfilDocenteMapper mapper;

    // 🔑 Método auxiliar para calcular la edad
    private Integer calcularEdad(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            return null;
        }
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }

    @Transactional
    public PerfilDocenteDTO crear(PerfilDocenteDTO dto) {
        Usuarios usuario = usuariosRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));

        if (docenteRepository.existsByUsuarioId(usuario.getId())) {
            throw new RuntimeException("El usuario ya tiene un perfil docente asignado");
        }

        PerfilDocente docente = mapper.toEntity(dto);
        docente.setUsuario(usuario);
        docente.setEdad(calcularEdad(dto.getFechaNacimiento()));

        return mapper.toDto(docenteRepository.save(docente));
    }

    private String obtenerRolDesdeUsuario(Usuarios usuario) {
        return usuario.getRoles().stream()
                .map(Rol::getRol) // ajusta al getter real de tu entidad Rol
                .findFirst()
                .orElseThrow(() -> new RuntimeException("El usuario no tiene roles asignados"));
    }




    // READ (Todos)
    public List<PerfilDocenteDTO> listar() {
        return mapper.toDtoList(docenteRepository.findAll());
    }

    // READ (Uno por ID)
    public PerfilDocenteDTO obtenerPorId(Long id) {
        PerfilDocente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado con ID: " + id));
        return mapper.toDto(docente);
    }

    // UPDATE
    @Transactional
    public PerfilDocenteDTO actualizar(Long id, PerfilDocenteDTO dto) {
        PerfilDocente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado con ID: " + id));

        // Actualiza los campos simples
        mapper.updateEntityFromDto(dto, docente);

        // Actualiza el usuario asociado si viene especificado
        if (dto.getUsuarioId() != null) {
            Usuarios usuario = usuariosRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));
            docente.setUsuario(usuario);
        }

        // 🔑 Recalcular la edad si se envió una nueva fecha de nacimiento
        if (dto.getFechaNacimiento() != null) {
            docente.setEdad(calcularEdad(dto.getFechaNacimiento()));
        }

        PerfilDocente actualizado = docenteRepository.save(docente);
        return mapper.toDto(actualizado);
    }

    // DELETE
    @Transactional
    public void eliminar(Long id) {
        if (!docenteRepository.existsById(id)) {
            throw new RuntimeException("Docente no encontrado con ID: " + id);
        }
        docenteRepository.deleteById(id);
    }
}
