package Escuela.ReporteAsistencia.controllers;

import Escuela.ReporteAsistencia.dtos.AsistenciaDTO;
import Escuela.ReporteAsistencia.dtos.asistenciaDTO.*;
import Escuela.ReporteAsistencia.services.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/asistencias")
public class AsistenciaController {



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

}

