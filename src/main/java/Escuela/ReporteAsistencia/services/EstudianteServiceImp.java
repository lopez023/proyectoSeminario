package Escuela.ReporteAsistencia.services;


import Escuela.ReporteAsistencia.dtos.EstudianteDTO;
import Escuela.ReporteAsistencia.interfaceModels.EstudianteService;
import Escuela.ReporteAsistencia.mappers.EstudianteMapper;
import Escuela.ReporteAsistencia.models.Estudiantes;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.EstudianteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EstudianteServiceImp implements EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private SeccionesRepository seccionesRepository;

    @Autowired
    private EstudianteMapper mapper;

    // CREATE
    public EstudianteDTO crear(EstudianteDTO dto) {

        Estudiantes entidad = mapper.toEntity(dto);
  //      entidad.setSeccion(seccion);

         Secciones seccion = seccionesRepository.findById(dto.getSeccionId())
                .orElseThrow(() -> new RuntimeException("No se encontró la sección con nombre: " + dto.getGradoId()));

        // LÓGICA DE NEGOCIO: Procesar año de nacimiento y generar código
        if (dto.getFechaNacimiento() != null) {
            int edad = calcularEdad(dto.getFechaNacimiento());
            // Aquí puedes usar la 'edad' para validaciones si lo necesitas (ej. lanzar excepción si es menor de edad)

            entidad.setEdad(edad);

            String nuevoCodigo = generarCodigoEstudiante(dto);
            entidad.setCodigoEstudiante(nuevoCodigo);
              entidad.setSeccion(seccion);

        }

        Estudiantes guardado = estudianteRepository.save(entidad);
        return mapper.toDto(guardado);
    }


    // READ - uno
    public EstudianteDTO findByCodigoEstudiante(String codigo) {
        Estudiantes e = estudianteRepository.findByCodigoEstudiante(codigo)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + codigo));
        return mapper.toDto(e);
    }

    // READ - todos
    public List<EstudianteDTO> listar() {
        return mapper.toDtoList(estudianteRepository.findAll());
    }

    // UPDATE
    public EstudianteDTO actualizar(String codigo, EstudianteDTO dto) {
        Estudiantes e = estudianteRepository.findByCodigoEstudiante(codigo)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + codigo));

        // Actualiza los campos simples (Recuerda que en el mapper ignoramos el código)
        mapper.updateEntityFromDto(dto, e);

        // Actualiza la sección si viene en el DTO
        if (dto.getSeccionId() != null) {
            Secciones seccion = seccionesRepository.findById(dto.getSeccionId())
                    .orElseThrow(() -> new RuntimeException("Sección no encontrada con id: " + dto.getSeccionId()));
            e.setSeccion(seccion);
        }

        // LÓGICA DE NEGOCIO: Recalcular la edad si la fecha de nacimiento viene en el DTO
        if (dto.getFechaNacimiento() != null) {
            int edad = calcularEdad(dto.getFechaNacimiento());

            // 👈 ¡Faltaba esta línea para actualizar la edad en la base de datos!
            e.setEdad(edad);

            // (Opcional) Si quieres que el código original NUNCA cambie al editar,
            // quitas o comentas la generación de nuevoCodigo y el e.setCodigoEstudiante(nuevoCodigo).
        }

        Estudiantes actualizado = estudianteRepository.save(e);
        return mapper.toDto(actualizado);
    }

    // DELETE
    public void eliminar(Long id) {
        if (!estudianteRepository.existsById(id)) {
            throw new RuntimeException("Estudiante no encontrado con id: " + id);
        }
        estudianteRepository.deleteById(id);
    }

    // --- MÉTODOS PRIVADOS DE LÓGICA DE NEGOCIO ---

    private int calcularEdad(LocalDate fechaNacimiento) {
        return java.time.Period.between(fechaNacimiento, java.time.LocalDate.now()).getYears();
    }

    private String generarCodigoEstudiante(EstudianteDTO dto) {
        int anioNacimiento = dto.getFechaNacimiento().getYear();

        // Obtenemos iniciales seguras evitando NullPointerException si los campos vienen vacíos
        String n = (dto.getNombre() != null && !dto.getNombre().isEmpty()) ? dto.getNombre().substring(0, 1) : "X";
        String a = (dto.getPrimerApellido() != null && !dto.getPrimerApellido().isEmpty()) ? dto.getPrimerApellido().substring(0, 1) : "X";
        String iniciales = (n + a).toUpperCase();

        // Estructura de ejemplo: EST-2015-AM (Puedes cambiarla por tu nomenclatura exacta)
        return "EST-" + anioNacimiento + "-" + iniciales;
    }

    public Long totalEstudiante(){
        return estudianteRepository.count();
    }

}
