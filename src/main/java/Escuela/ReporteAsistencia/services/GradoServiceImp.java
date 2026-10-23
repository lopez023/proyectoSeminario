package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.GradoDTO;
import Escuela.ReporteAsistencia.interfaceModels.GradoService;
import Escuela.ReporteAsistencia.mappers.GradoMapper;
import Escuela.ReporteAsistencia.models.Grados;
import Escuela.ReporteAsistencia.repositories.GradoRepository;
//import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class GradoServiceImp implements GradoService {

    @Autowired
    private GradoRepository gradosRepository;

    @Autowired
    private GradoMapper gradoMapper;

    // CREATE
    @Transactional
    public GradoDTO crear(GradoDTO dto) {
        Grados grado = gradoMapper.toEntity(dto);
        Grados guardado = gradosRepository.save(grado);
        return gradoMapper.toDto(guardado);
    }

    @Transactional(readOnly = true)
    public List<GradoDTO> listar() {
        return gradoMapper.toDtoList(gradosRepository.findAll());
    }

    // READ (Uno por ID)

    @Transactional(readOnly = true)
    public GradoDTO obtenerPorId(Long id) {
        Grados grado = gradosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado no encontrado con ID: " + id));
        return gradoMapper.toDto(grado);
    }

    // UPDATE
    @Transactional
    public GradoDTO actualizar(Long id, GradoDTO dto) {
        Grados grado = gradosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado no encontrado con ID: " + id));

        // Actualiza los campos (nombreGrado y description)
        gradoMapper.updateEntityFromDto(dto, grado);

        Grados actualizado = gradosRepository.save(grado);
        return gradoMapper.toDto(actualizado);
    }

    // DELETE
    @Transactional
    public void eliminar(Long id) {
        if (!gradosRepository.existsById(id)) {
            throw new RuntimeException("Grado no encontrado con ID: " + id);
        }
        // Nota: Gracias a cascade = CascadeType.ALL y orphanRemoval = true en la entidad,
        // si eliminas un grado, se eliminarán en cascada sus secciones asociadas si es requerido.
        gradosRepository.deleteById(id);
    }
}
