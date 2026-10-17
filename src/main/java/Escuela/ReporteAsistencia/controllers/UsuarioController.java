package Escuela.ReporteAsistencia.controllers;

import Escuela.ReporteAsistencia.dtos.UsuarioDTO;
import Escuela.ReporteAsistencia.interfaceModels.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuariosService usuarioService;

    @PostMapping
   @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioDTO> crear(@RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.crear(dto));

    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok("Usuario eliminado correctamente.");
    }

    @GetMapping("/nombre/{nombreDocente}")
    public ResponseEntity<String> obtenerNombre(@PathVariable String nombreDocente) {

        return ResponseEntity.ok(usuarioService.obtenerNombre(nombreDocente));
    }


    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    @GetMapping("/usuario/{usuario}")
    public ResponseEntity<UsuarioDTO> obtenerUsuario(@PathVariable String usuario) {

        return ResponseEntity.ok(usuarioService.obtenerPorusuario(usuario));
    }


}
