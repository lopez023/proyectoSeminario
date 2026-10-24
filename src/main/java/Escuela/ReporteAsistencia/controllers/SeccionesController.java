package Escuela.ReporteAsistencia.controllers;


import Escuela.ReporteAsistencia.dtos.SeccionDTO;
import Escuela.ReporteAsistencia.dtos.asistenciaDTO.SeccionesDTO;
import Escuela.ReporteAsistencia.interfaceModels.SeccionProjection;
import Escuela.ReporteAsistencia.interfaceModels.SeccionesService;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/secciones")
public class SeccionesController {


    @Autowired
    private SeccionesService seccionService;

    @Autowired
    private SeccionesRepository seccionesRepository;

    @PostMapping
    public ResponseEntity<SeccionDTO> crear(@RequestBody SeccionDTO dto) {
        return ResponseEntity.ok(seccionService.crear(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SeccionDTO>> listar() {
        return ResponseEntity.ok(seccionService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeccionDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(seccionService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeccionDTO> actualizar(@PathVariable Long id, @RequestBody SeccionDTO dto) {
        return ResponseEntity.ok(seccionService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        seccionService.eliminar(id);
        return ResponseEntity.ok("Sección eliminada correctamente.");
    }


    @GetMapping("/con-estudiantes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SeccionProjection>> obtenerSeccionesConEstudiantes() {
        List<SeccionProjection> secciones = seccionService.obtenerSeccionesConEstudiantes();
        return ResponseEntity.ok(secciones);
    }



    @GetMapping("/SeccionesYGrados")
    public ResponseEntity<List<SeccionesDTO>> obtenerSeccionesConGrados() {
        try {
            // Intenta la consulta optimizada por BD
            List<SeccionesDTO> secciones = seccionesRepository.obtenerSeccionesConConteoEstudiantes();
            return ResponseEntity.ok(secciones);
        } catch (Exception e) {
            System.err.println("Error en JPQL / PostgreSQL, ejecutando mapeo de respaldo: " + e.getMessage());

            // Mapeo seguro en memoria si PostgreSQL falla en Render
            List<Secciones> listaEntidades = seccionesRepository.findAll();
            List<SeccionesDTO> dtosFallback = new ArrayList<>();

            for (Secciones sec : listaEntidades) {
                Long docenteId = null;
                String nombreDocente = "Sin asignar";

                if (sec.getDocente() != null) {
                    docenteId = sec.getDocente().getId();
                    String nom = sec.getDocente().getNombre() != null ? sec.getDocente().getNombre() : "";
                    String ape = sec.getDocente().getPrimerApellido() != null ? sec.getDocente().getPrimerApellido() : "";
                    nombreDocente = (nom + " " + ape).trim();
                }

                Long gradoId = sec.getGrado() != null ? sec.getGrado().getId() : null;
                String nombreGrado = sec.getGrado() != null ? sec.getGrado().getNombreGrado() : "Sin Grado";
                long totalEstudiantes = sec.getEstudiantes() != null ? sec.getEstudiantes().size() : 0L;

                dtosFallback.add(new SeccionesDTO(
                        sec.getId(),
                        sec.getNombre(),
                        sec.getCupoMaximo(),
                        gradoId,
                        nombreGrado,
                        docenteId,
                        nombreDocente,
                        totalEstudiantes
                ));
            }

            return ResponseEntity.ok(dtosFallback);
        }
    }
}
