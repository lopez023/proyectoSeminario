package Escuela.ReporteAsistencia.controllers;

import Escuela.ReporteAsistencia.dtos.GradoDTO;
import Escuela.ReporteAsistencia.interfaceModels.GradoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/grado")
public class GradoController {
    @Autowired
    private GradoService gradoService;

    @PostMapping
    public ResponseEntity<GradoDTO> crear(@RequestBody GradoDTO dto) {
        return ResponseEntity.ok(gradoService.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<GradoDTO>> listar() {
        return ResponseEntity.ok(gradoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(gradoService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradoDTO> actualizar(@PathVariable Long id, @RequestBody GradoDTO dto) {
        return ResponseEntity.ok(gradoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        gradoService.eliminar(id);
        return ResponseEntity.ok("Grado eliminado correctamente.");
    }
}
