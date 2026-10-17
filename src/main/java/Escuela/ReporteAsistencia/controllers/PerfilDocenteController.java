package Escuela.ReporteAsistencia.controllers;

import Escuela.ReporteAsistencia.dtos.PerfilDocenteDTO;
import Escuela.ReporteAsistencia.interfaceModels.PerfilDocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfilDocente")
public class PerfilDocenteController {
    @Autowired
    private PerfilDocenteService docenteService;

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
}
