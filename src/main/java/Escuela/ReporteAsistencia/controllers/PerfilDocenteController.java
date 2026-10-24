package Escuela.ReporteAsistencia.controllers;

import Escuela.ReporteAsistencia.dtos.PerfilDocenteDTO;
import Escuela.ReporteAsistencia.dtos.asistenciaDTO.DocenteVistaDTO;
import Escuela.ReporteAsistencia.dtos.asistenciaDTO.EstudianteResumenDTO;
import Escuela.ReporteAsistencia.interfaceModels.PerfilDocenteService;
import Escuela.ReporteAsistencia.models.PerfilDocente;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.PerfilDocenteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/perfilDocente")
public class PerfilDocenteController {
    @Autowired
    private PerfilDocenteService docenteService;

    @Autowired
    PerfilDocenteRepository docenteRepository;

    @Autowired
    private SeccionesRepository seccionesRepository;


    @PostMapping
    public ResponseEntity<PerfilDocenteDTO> crear(@RequestBody PerfilDocenteDTO dto) {
        return ResponseEntity.ok(docenteService.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<PerfilDocenteDTO>> listar() {
        return ResponseEntity.ok(docenteService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilDocenteDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(docenteService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilDocenteDTO> actualizar(@PathVariable Long id, @RequestBody PerfilDocenteDTO dto) {
        return ResponseEntity.ok(docenteService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        docenteService.eliminar(id);
        return ResponseEntity.ok("Docente eliminado correctamente.");
    }


    @GetMapping("/{id}/dashboard")
    public ResponseEntity<?> obtenerDashboardDocente(@PathVariable Long id) {
        try {
            PerfilDocente docente = docenteRepository.findById(id).orElse(null);

            if (docente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Docente no encontrado con ID: " + id);
            }

            Secciones seccion = docente.getSecciones();

            // Construcción segura del nombre completo del docente evitando NPE
            String nombreDocente = (docente.getNombre() != null ? docente.getNombre() : "") + " " +
                    (docente.getPrimerApellido() != null ? docente.getPrimerApellido() : "");

            // Manejo seguro si el docente no tiene sección asignada en la BD
            if (seccion == null) {
                DocenteVistaDTO respuestaVacia = new DocenteVistaDTO(
                        docente.getId(),
                        nombreDocente.trim(),
                        "Sin Grado",
                        "Sin Sección",
                        Collections.emptyList()
                );
                return ResponseEntity.ok(respuestaVacia);
            }

            // Obtener estudiantes de la sección del docente
            List<EstudianteResumenDTO> estudiantes = seccionesRepository.obtenerEstudiantesConUltimaAsistencia(id);

            String nombreGrado = (seccion.getGrado() != null) ? seccion.getGrado().getNombreGrado() : "Sin Grado";
            String nombreSeccion = (seccion.getNombre() != null) ? seccion.getNombre() : "Sin Sección";

            DocenteVistaDTO response = new DocenteVistaDTO(
                    docente.getId(),
                    nombreDocente.trim(),
                    nombreGrado,
                    nombreSeccion,
                    estudiantes != null ? estudiantes : Collections.emptyList()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el dashboard del docente: " + e.getMessage());
        }
    }
}
