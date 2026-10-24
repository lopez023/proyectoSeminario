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
    public ResponseEntity<List<SeccionesDTO>> obtenerTodasLasSecciones() {
        List<Secciones> listaSecciones = seccionesRepository.findAll();

        List<SeccionesDTO> dtos = listaSecciones.stream().map(sec -> new SeccionesDTO(
                sec.getId(),
                sec.getNombre(),
                sec.getCupoMaximo(),
                sec.getGrado() != null ? sec.getGrado().getId() : null,
                sec.getGrado() != null ? sec.getGrado().getNombreGrado() : null,
                sec.getDocente() != null ? sec.getDocente().getId() : null,
                sec.getDocente() != null
                        ? (sec.getDocente().getNombre() + " " + (sec.getDocente().getPrimerApellido() != null ? sec.getDocente().getPrimerApellido() : ""))
                        : "Sin asignar",
                sec.getEstudiantes() != null ? (long) sec.getEstudiantes().size() : 0L
        )).toList();

        return ResponseEntity.ok(dtos);
    }
}
