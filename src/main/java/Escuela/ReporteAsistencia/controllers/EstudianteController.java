package Escuela.ReporteAsistencia.controllers;


import Escuela.ReporteAsistencia.dtos.EstudianteDTO;
import Escuela.ReporteAsistencia.interfaceModels.EstudianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    // CREATE - Registrar un nuevo estudiante
    @PostMapping
    public ResponseEntity<EstudianteDTO> crear(@RequestBody EstudianteDTO dto) {
        EstudianteDTO nuevoEstudiante = estudianteService.crear(dto);
        return ResponseEntity.ok(nuevoEstudiante);
    }

    // READ - Listar todos los estudiantes

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<EstudianteDTO>> listar() {
        List<EstudianteDTO> estudiantes = estudianteService.listar();
        return ResponseEntity.ok(estudiantes);
    }

    // READ - Obtener un estudiante por su codigo
    @GetMapping("/{codigo}")
    public ResponseEntity<EstudianteDTO> obtenerPorId(@PathVariable String codigo) {
        EstudianteDTO estudiante = estudianteService.findByCodigoEstudiante(codigo);
        return ResponseEntity.ok(estudiante);
    }

    // UPDATE - Actualizar los datos de un estudiante existente
    @PutMapping("/{codigo}")
    public ResponseEntity<EstudianteDTO> actualizar(@PathVariable String codigo, @RequestBody EstudianteDTO dto) {
        EstudianteDTO estudianteActualizado = estudianteService.actualizar(codigo, dto);
        return ResponseEntity.ok(estudianteActualizado);
    }

    // DELETE - Eliminar un estudiante por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
        return ResponseEntity.ok("Estudiante eliminado correctamente.");
    }

    @GetMapping("/cantidadTotal")
    public ResponseEntity<Long> obtenerCantidadEstudiante() {

        long cantidad = estudianteService.totalEstudiante();
        System.out.println("=== CANTIDAD REAL DESDE LA BD: " + cantidad + " ===");
        return ResponseEntity.ok(cantidad);

//        return  ResponseEntity.ok(estudianteService.totalEstudiante());
    }
}
