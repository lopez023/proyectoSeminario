package Escuela.ReporteAsistencia.controllers;


import Escuela.ReporteAsistencia.dtos.RolDTO;
import Escuela.ReporteAsistencia.interfaceModels.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {
    @Autowired
    private RolService rolService;

    @PostMapping
    public ResponseEntity<RolDTO> crear(@RequestBody RolDTO dto) {

        return ResponseEntity.ok(rolService.crear(dto));
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<RolDTO>> listar() {
        return ResponseEntity.ok(rolService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(rolService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolDTO> actualizar(@PathVariable Long id, @RequestBody RolDTO dto) {
        return ResponseEntity.ok(rolService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        rolService.eliminar(id);
        return ResponseEntity.ok("Rol eliminado correctamente.");
    }
}
