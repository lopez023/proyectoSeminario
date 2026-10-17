package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.RolDTO;
import Escuela.ReporteAsistencia.interfaceModels.RolService;
import Escuela.ReporteAsistencia.mappers.RolMapper;
import Escuela.ReporteAsistencia.models.Rol;
import Escuela.ReporteAsistencia.repositories.RolRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RolServiceImp implements RolService {


    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private RolMapper rolMapper;

    // CREATE
    @Transactional
    public RolDTO crear(RolDTO dto) {
        Rol rol = rolMapper.toEntity(dto);
        Rol guardado = rolRepository.save(rol);
        return rolMapper.toDto(guardado);
    }

    // READ (Todos)
    public List<RolDTO> listar() {
        return rolMapper.toDtoList(rolRepository.findAll());
    }

    // READ (Uno por ID)
    public RolDTO obtenerPorId(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));
        return rolMapper.toDto(rol);
    }

    // UPDATE
    @Transactional
    public RolDTO actualizar(Long id, RolDTO dto) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));

        rolMapper.updateEntityFromDto(dto, rol);

        Rol actualizado = rolRepository.save(rol);
        return rolMapper.toDto(actualizado);
    }

    // DELETE
    @Transactional
    public void eliminar(Long id) {
        if (!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado con ID: " + id);
        }
        rolRepository.deleteById(id);
    }
}
