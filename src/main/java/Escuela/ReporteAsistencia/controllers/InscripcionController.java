package Escuela.ReporteAsistencia.controllers;


import Escuela.ReporteAsistencia.dtos.InscripcionDTO;
import Escuela.ReporteAsistencia.services.InscripcionServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {


    @Autowired
    private InscripcionServiceImp inscripcionService;

    @PostMapping
    public ResponseEntity<String> inscribirEstudiante(@RequestBody InscripcionDTO dto) {
        try {
            inscripcionService.matricularEstudiante(dto);
            return ResponseEntity.ok("Estudiante inscrito correctamente en el grado y sección.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en la inscripción: " + e.getMessage());
        }
    }
}
