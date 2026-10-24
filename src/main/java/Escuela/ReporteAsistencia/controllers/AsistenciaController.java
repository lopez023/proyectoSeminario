package Escuela.ReporteAsistencia.controllers;

import Escuela.ReporteAsistencia.dtos.AsistenciaDTO;
import Escuela.ReporteAsistencia.dtos.asistenciaDTO.*;
import Escuela.ReporteAsistencia.enums.EstadoAsistencias;
import Escuela.ReporteAsistencia.repositories.AsistenciaRepository;
import Escuela.ReporteAsistencia.repositories.EstudianteRepository;
import Escuela.ReporteAsistencia.services.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

// CORRECTO:

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("api/asistencias")
public class AsistenciaController {


    @Autowired
    private EstudianteRepository estudiantesRepository;

    @Autowired
    private AsistenciaRepository asistenciasRepository;


    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    // 1. Registrar asistencia masiva


    @PostMapping("/registrar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<String> registrar(@RequestBody RegistroAsistenciaDTO dto) {
        asistenciaService.registrarAsistenciaGrupal(dto);
        return ResponseEntity.ok("Asistencia registrada correctamente");
    }



    // 2. Semana de un estudiante
    @GetMapping("/estudiante/{id}/semana")
    public AsistenciaSemanalDTO semanaEstudiante(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate lunes) {
        return asistenciaService.obtenerSemanaEstudiante(id, lunes);
    }

    // 3. Porcentaje de un estudiante en un rango
    @GetMapping("/estudiante/{id}/porcentaje")
    public double porcentaje(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return asistenciaService.calcularPorcentaje(id, inicio, fin);
    }

    // 4. Todos los estudiantes en una fecha
    @GetMapping("/fecha/{fecha}")
    public List<EstadoDiarioDTO> todosPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return asistenciaService.listarTodosPorFecha(fecha);
    }

    // 5. Reporte semanal del grupo con porcentajes
    @GetMapping("/grupo/semana")
    public List<ResumenEstudianteDTO> reporteSemanal(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate lunes) {
        return asistenciaService.reporteSemanalGrupo(lunes);
    }

    // 6. Listar asistencias de una fecha (DTO simple)
    @GetMapping("/lista/{fecha}")
    public List<AsistenciaResponseDTO> listarPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return asistenciaService.listarPorFecha(fecha);
    }



    @GetMapping("/lista")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<ListaAsistenciaDTO> consultarLista(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha,
            Authentication authentication) {

        ListaAsistenciaDTO resultado =
                asistenciaService.consultarAsistenciaDocente(
                        authentication.getName(),
                        fecha
                );

        return ResponseEntity.ok(resultado);
    }




    @GetMapping("/resumen")
    public ResponseEntity<DashboardResumenDTO> obtenerResumenDashboard() {
        LocalDate hoy = LocalDate.now(ZoneId.of("America/Guatemala"));

        long totalAlumnos = estudiantesRepository.count();
        long presentes = asistenciasRepository.countByFechaAndEstado(hoy, EstadoAsistencias.PRESENTE);
        long ausentes = asistenciasRepository.countByFechaAndEstado(hoy, EstadoAsistencias.AUSENTE);
        long tardanzas = asistenciasRepository.countByFechaAndEstado(hoy, EstadoAsistencias.TARDE);

        // Cálculo de porcentajes evitando división entre cero
        int pctPresentes = totalAlumnos > 0 ? (int) Math.round((presentes * 100.0) / totalAlumnos) : 0;
        int pctAusentes = totalAlumnos > 0 ? (int) Math.round((ausentes * 100.0) / totalAlumnos) : 0;
        int pctTardanzas = totalAlumnos > 0 ? (int) Math.round((tardanzas * 100.0) / totalAlumnos) : 0;

        // Obtener las últimas 5 asistencias del día

        List<UltimaAsistenciaDTO> ultimasAsistencias = asistenciasRepository.obtenerUltimasAsistenciasDelDia(hoy);

        DashboardResumenDTO resumen = new DashboardResumenDTO(
                totalAlumnos,
                presentes, pctPresentes,
                ausentes, pctAusentes,
                tardanzas, pctTardanzas,
                ultimasAsistencias
        );

        return ResponseEntity.ok(resumen);
    }

}

