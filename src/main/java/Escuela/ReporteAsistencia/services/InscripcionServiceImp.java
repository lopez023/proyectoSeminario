package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.InscripcionDTO;
import Escuela.ReporteAsistencia.models.Estudiantes;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.EstudianteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InscripcionServiceImp {


    @Autowired
    private EstudianteRepository estudiantesRepository;

    @Autowired
    private SeccionesRepository seccionesRepository;

    @Transactional
    public void matricularEstudiante(InscripcionDTO dto) {

        // 1. Buscamos al estudiante que ya fue registrado previamente con sus datos personales
        Estudiantes estudiante = estudiantesRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con ID: " + dto.getEstudianteId()));

        // 2. Buscamos la sección a la que se desea inscribir
        Secciones seccion = seccionesRepository.findById(dto.getSeccionId())
                .orElseThrow(() -> new RuntimeException("Sección no encontrada con ID: " + dto.getSeccionId()));

        // 3. Validación de seguridad lógica:
        // Verificamos que la sección seleccionada realmente pertenezca al grado enviado en el JSON
        if (!seccion.getGrado().getId().equals(dto.getGradoId())) {
            throw new IllegalArgumentException("La sección seleccionada no corresponde al grado indicado.");
        }

        // 4. Asignamos la sección al estudiante
        estudiante.setSeccion(seccion);

        // 5. Guardamos los cambios en la base de datos
        estudiantesRepository.save(estudiante);
    }
}
