package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.SeccionDTO;
import Escuela.ReporteAsistencia.interfaceModels.SeccionProjection;
import Escuela.ReporteAsistencia.interfaceModels.SeccionesService;
import Escuela.ReporteAsistencia.mappers.SeccionMapper;
import Escuela.ReporteAsistencia.models.Grados;
import Escuela.ReporteAsistencia.models.PerfilDocente;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.GradoRepository;
import Escuela.ReporteAsistencia.repositories.PerfilDocenteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class SeccionesServiceImp implements SeccionesService {

    @Autowired
    private SeccionesRepository seccionRepository;

    @Autowired
    private GradoRepository gradosRepository;

    @Autowired
    private PerfilDocenteRepository perfilDocenteRepository;

    @Autowired
    private SeccionMapper mapper;

    // CREATE
    @Transactional
    public SeccionDTO crear(SeccionDTO dto) {
        Grados grado = gradosRepository.findById(dto.getGradoId())
                .orElseThrow(() -> new RuntimeException("Grado no encontrado con ID: " + dto.getGradoId()));

        Secciones seccion = mapper.toEntity(dto);
        seccion.setGrado(grado);

        // El docente es opcional
        if (dto.getDocenteId() != null) {
            PerfilDocente docente = perfilDocenteRepository.findById(dto.getDocenteId())
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado con ID: " + dto.getDocenteId()));
            seccion.setDocente(docente);
        }

        Secciones guardada = seccionRepository.save(seccion);
        return mapper.toDto(guardada);
    }

    // READ (Todos)
    public List<SeccionDTO> listar() {
        return mapper.toDtoList(seccionRepository.findAll());
    }

    // READ (Uno por ID)
    public SeccionDTO obtenerPorId(Long id) {
        Secciones seccion = seccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada con ID: " + id));
        return mapper.toDto(seccion);
    }

    // UPDATE
    @Transactional
    public SeccionDTO actualizar(Long id, SeccionDTO dto) {
        Secciones seccion = seccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada con ID: " + id));

        // Actualiza campos básicos
        mapper.updateEntityFromDto(dto, seccion);

        // Actualiza el grado si viene especificado
        if (dto.getGradoId() != null) {
            Grados grado = gradosRepository.findById(dto.getGradoId())
                    .orElseThrow(() -> new RuntimeException("Grado no encontrado con ID: " + dto.getGradoId()));
            seccion.setGrado(grado);
        }

        // Actualiza o remueve el docente
        if (dto.getDocenteId() != null) {
            PerfilDocente docente = perfilDocenteRepository.findById(dto.getDocenteId())
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado con ID: " + dto.getDocenteId()));
            seccion.setDocente(docente);
        } else {
            seccion.setDocente(null); // Permite desasignar el docente si envían null
        }

        Secciones actualizada = seccionRepository.save(seccion);
        return mapper.toDto(actualizada);
    }

    // DELETE
    @Transactional
    public void eliminar(Long id) {
        if (!seccionRepository.existsById(id)) {
            throw new RuntimeException("Sección no encontrada con ID: " + id);
        }
        seccionRepository.deleteById(id);
    }


    public List<SeccionProjection> obtenerSeccionesConEstudiantes() {
        List<SeccionProjection> secciones = seccionRepository.findAllProjections();
        return secciones;
    }
}
