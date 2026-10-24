package Escuela.ReporteAsistencia.services;

import Escuela.ReporteAsistencia.dtos.asistenciaDTO.*;
import Escuela.ReporteAsistencia.enums.EstadoAsistencias;
import Escuela.ReporteAsistencia.models.*;
import Escuela.ReporteAsistencia.repositories.AsistenciaRepository;
import Escuela.ReporteAsistencia.repositories.EstudianteRepository;
import Escuela.ReporteAsistencia.repositories.PerfilDocenteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AsistenciaService {
    private final AsistenciaRepository asistenciaRepository;
    private final EstudianteRepository estudianteRepository;
    private final PerfilDocenteRepository perfilDocenteRepository;
    private final SeccionesRepository seccionesRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository,
                             EstudianteRepository estudianteRepository,
                            PerfilDocenteRepository perfilDocenteRepository,
                             SeccionesRepository seccionesRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.estudianteRepository = estudianteRepository;
        this.perfilDocenteRepository = perfilDocenteRepository;
        this.seccionesRepository = seccionesRepository;}

    // =====================================================
    // 1. REGISTRAR ASISTENCIA MASIVA
    // =====================================================
    @Transactional
    public void registrarAsistenciaGrupal(RegistroAsistenciaDTO dto) {

        LocalTime horaActual = LocalTime.now();
        LocalDate fechaActual = LocalDate.now();

        for (DetalleAsistenciaDTO det : dto.getDetalles()) {
            Estudiantes est = estudianteRepository.findById(det.getEstudianteId())
                    .orElseThrow(() -> new RuntimeException(
                            "Estudiante no encontrado: " + det.getEstudianteId()));


            Asistencias asistencia = asistenciaRepository
                    .findByEstudianteIdAndFecha(est.getId(), fechaActual)
                    .orElse(new Asistencias());

            asistencia.setEstudiante(est);
            asistencia.setFecha(fechaActual);
            asistencia.setEstado(det.getEstado());
            asistencia.setComentario(det.getObservacion());
            asistencia.setHora(horaActual);

            asistenciaRepository.save(asistencia);
        }
    }

    // =====================================================
    // 2. ASISTENCIA DE UNA SEMANA DE UN ESTUDIANTE
    // =====================================================
    public AsistenciaSemanalDTO obtenerSemanaEstudiante(Long estudianteId, LocalDate lunes) {
        LocalDate domingo = lunes.plusDays(6);

        Estudiantes est = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        List<Asistencias> lista = asistenciaRepository
                .findByEstudianteIdAndFechaBetweenOrderByFechaAsc(
                        estudianteId, lunes, domingo);

        Map<LocalDate, EstadoAsistencias> porDia = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate dia = lunes.plusDays(i);
            porDia.put(dia, EstadoAsistencias.AUSENTE); // valor por defecto
        }
        lista.forEach(a -> porDia.put(a.getFecha(), a.getEstado()));

        AsistenciaSemanalDTO dto = new AsistenciaSemanalDTO();
        dto.setEstudianteId(estudianteId);
        dto.setNombreEstudiante(est.getNombre() + " " + est.getPrimerApellido());
        dto.setInicio(lunes);
        dto.setFin(domingo);
        dto.setDetallePorDia(porDia);
        dto.setPorcentaje(calcularPorcentaje(estudianteId, lunes, domingo));
        return dto;
    }

    // =====================================================
    // 3. CALCULAR PORCENTAJE DE UN ESTUDIANTE EN UN RANGO
    // =====================================================
    public double calcularPorcentaje(Long estudianteId, LocalDate inicio, LocalDate fin) {
        long total = asistenciaRepository.countByEstudianteIdAndFechaBetween(
                estudianteId, inicio, fin);
        if (total == 0) return 0.0;

        long presentes = asistenciaRepository.countByEstudianteIdAndFechaBetweenAndEstado(
                estudianteId, inicio, fin, EstadoAsistencias.PRESENTE);
        long tardes = asistenciaRepository.countByEstudianteIdAndFechaBetweenAndEstado(
                estudianteId, inicio, fin, EstadoAsistencias.TARDE);
        long justificados = asistenciaRepository.countByEstudianteIdAndFechaBetweenAndEstado(
                estudianteId, inicio, fin, EstadoAsistencias.JUSTIFICADO);

        // Regla: PRESENTE = 1, TARDE = 0.5, JUSTIFICADO = 1, AUSENTE = 0
        double puntos = presentes + (tardes * 0.5) + justificados;
        double porcentaje = (puntos / total) * 100.0;
        return Math.round(porcentaje * 100.0) / 100.0;
    }

    // =====================================================
    // 4. ESTADO DE TODOS LOS ESTUDIANTES EN UNA FECHA
    // =====================================================
    public List<EstadoDiarioDTO> listarTodosPorFecha(LocalDate fecha) {
        return asistenciaRepository.findByFechaOrderByEstudiante_PrimerApellidoAsc(fecha)
                .stream()
                .map(a -> new EstadoDiarioDTO(
                        a.getEstudiante().getId(),
                        a.getEstudiante().getNombre() + " " + a.getEstudiante().getPrimerApellido(),
                        a.getEstudiante().getCodigoEstudiante(),
                        a.getEstado()))
                .toList();
    }

    // =====================================================
    // 5. REPORTE SEMANAL DEL GRUPO CON PORCENTAJES
    // =====================================================
    public List<ResumenEstudianteDTO> reporteSemanalGrupo(LocalDate lunes) {
        LocalDate domingo = lunes.plusDays(6);

        List<Asistencias> asistencias = asistenciaRepository.findByFechaBetween(lunes, domingo);

        Map<Estudiantes, List<Asistencias>> porEstudiante = asistencias.stream()
                .collect(Collectors.groupingBy(Asistencias::getEstudiante));

        List<ResumenEstudianteDTO> resultado = new ArrayList<>();

        for (var entry : porEstudiante.entrySet()) {
            Estudiantes est = entry.getKey();
            List<Asistencias> lista = entry.getValue();

            long presentes = contar(lista, EstadoAsistencias.PRESENTE);
            long tardes    = contar(lista, EstadoAsistencias.TARDE);
            long ausentes  = contar(lista, EstadoAsistencias.AUSENTE);
            long justif    = contar(lista, EstadoAsistencias.JUSTIFICADO);
            long total     = lista.size();

            double puntos = presentes + (tardes * 0.5) + justif;
            double porcentaje = total == 0 ? 0 : (puntos / total) * 100.0;
            porcentaje = Math.round(porcentaje * 100.0) / 100.0;

            resultado.add(new ResumenEstudianteDTO(
                    est.getId(),
                    est.getNombre() + " " + est.getPrimerApellido(),
                    est.getCodigoEstudiante(),
                    presentes, tardes, ausentes, justif, total,
                    porcentaje));
        }

        resultado.sort(Comparator.comparingDouble(ResumenEstudianteDTO::porcentaje).reversed());
        return resultado;
    }

    // =====================================================
    // 6. LISTAR ASISTENCIAS DE UNA FECHA (DTO simple)
    // =====================================================
 /*   public List<AsistenciaResponseDTO> listarPorFecha(LocalDate fecha) {
        return asistenciaRepository.findByFechaOrderByEstudiante_PrimerApellidoAsc(fecha)
                .stream()
                .map(this::toDTO)
                .toList();
    }*/




    public List<AsistenciaResponseDTO> listarPorFecha(LocalDate fecha) {
        // 1. Intentar obtener asistencias ya tomadas en esa fecha
        List<Asistencias> asistenciasGuardadas = asistenciaRepository.findByFechaOrderByEstudiante_PrimerApellidoAsc(fecha);

        // 2. Si ya se tomó asistencia ese día, retornamos esas asistencias
        if (!asistenciasGuardadas.isEmpty()) {
            return asistenciasGuardadas.stream()
                    .map(this::toDTO)
                    .toList();
        }

        // 3. Si NO se ha tomado asistencia, traemos los estudiantes para permitir registrarla
        List<Estudiantes> estudiantes = estudianteRepository.findAll(); // O utiliza tu método de ordenamiento

        return estudiantes.stream().map(estudiante -> {
            AsistenciaResponseDTO dto = new AsistenciaResponseDTO();
            dto.setId(null); // Registro nuevo
            dto.setEstudianteId(estudiante.getId());
            dto.setNombreEstudiante(estudiante.getNombre() + " " + estudiante.getPrimerApellido());
            dto.setMatricula(estudiante.getCodigoEstudiante());
            dto.setFecha(fecha);
            dto.setEstado(null); // En React se mapeará como SIN_REGISTRAR
            dto.setHora("-");
            dto.setObservacion("");
            return dto;
        }).toList();
    }

    // =====================================================
    // Método auxiliar privado
    // =====================================================
    private long contar(List<Asistencias> lista, EstadoAsistencias estado) {
        return lista.stream().filter(a -> a.getEstado() == estado).count();
    }


   /* private AsistenciaResponseDTO toDTO(Asistencias a) {
        AsistenciaResponseDTO dto = new AsistenciaResponseDTO();
        dto.setId(a.getId());
        dto.setNombreEstudiante(a.getEstudiante().getNombre() + " " +
                a.getEstudiante().getPrimerApellido());
        dto.setMatricula(a.getEstudiante().getCodigoEstudiante());
        dto.setFecha(a.getFecha());
        dto.setEstado(a.getEstado());
        dto.setObservacion(a.getComentario());
        return dto;
    }*/

    private AsistenciaResponseDTO toDTO(Asistencias asistencia) {
        AsistenciaResponseDTO dto = new AsistenciaResponseDTO();

        dto.setId(asistencia.getId());
        dto.setEstudianteId(asistencia.getEstudiante().getId());
        dto.setNombreEstudiante(
                asistencia.getEstudiante().getNombre() + " " +
                        asistencia.getEstudiante().getPrimerApellido()
        );
        dto.setMatricula(asistencia.getEstudiante().getCodigoEstudiante());
        dto.setFecha(asistencia.getFecha());
        dto.setEstado(asistencia.getEstado());
        dto.setObservacion(asistencia.getComentario());
        dto.setHora(
                asistencia.getHora() != null
                        ? asistencia.getHora().toString()
                        : null
        );

        return dto;
    }







    @Transactional//(readOnly = true)
    public ListaAsistenciaDTO consultarAsistenciaDocente(
            String username,
            LocalDate fecha) {

        // 1. Identificar al docente a partir del usuario autenticado
        PerfilDocente docente = perfilDocenteRepository
                .findByUsuario_Username(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un perfil docente para este usuario"
                ));

        // 2. Comprobar que tenga exactamente una sección asignada
        List<Secciones> secciones =
                seccionesRepository.findByDocente_Id(docente.getId());

        if (secciones.size() != 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El docente debe tener exactamente una sección asignada"
            );
        }

        Secciones seccion = secciones.get(0);

        // 3. Obtener el grado de esa sección
        Grados grado = seccion.getGrado();

        // 4. Obtener todos los estudiantes de la sección
        List<Estudiantes> estudiantes =
                estudianteRepository
                        .findBySeccion_IdOrderByIdAsc(seccion.getId());

        List<Long> ids = estudiantes.stream()
                .map(Estudiantes::getId)
                .toList();

        // 5. Obtener los registros de asistencia para esa fecha
        List<Asistencias> registros = ids.isEmpty()
                ? List.of()
                : asistenciaRepository
                .findByFechaAndEstudiante_IdIn(fecha, ids);

        Map<Long, Asistencias> registrosPorEstudiante =
                registros.stream().collect(Collectors.toMap(
                        a -> a.getEstudiante().getId(),
                        Function.identity()
                ));

        // 6. Crear una fila para cada estudiante, incluso si no tiene registro
        List<AsistenciaAlumnoDTO> alumnos = estudiantes.stream()
                .map(estudiante -> {
                    Asistencias asistencia =
                            registrosPorEstudiante.get(estudiante.getId());

                    String nombre = Stream.of(
                                    estudiante.getNombre(),
                                    estudiante.getPrimerApellido(),
                                    estudiante.getSegundoApellido()
                            )
                            .filter(Objects::nonNull)
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .collect(Collectors.joining(" "));

                    return new AsistenciaAlumnoDTO(
                            estudiante.getId(),
                            nombre,
                            asistencia == null
                                    ? "SIN_REGISTRAR"
                                    : asistencia.getEstado().name(),
                            asistencia == null || asistencia.getHora() == null
                                    ? "-"
                                    : asistencia.getHora().format(
                                    DateTimeFormatter.ofPattern("hh:mm a",
                                            Locale.US)),
                            asistencia == null
                                    || asistencia.getComentario() == null
                                    || asistencia.getComentario().isBlank()
                                    ? "-"
                                    : asistencia.getComentario()
                    );
                })
                .toList();

        // 7. Devolver los datos de la cabecera y la lista
        return new ListaAsistenciaDTO(
                fecha,
                seccion.getId(),
                seccion.getNombre(),
                grado.getId(),
                grado.getNombreGrado(),
                alumnos
        );
    }

}
