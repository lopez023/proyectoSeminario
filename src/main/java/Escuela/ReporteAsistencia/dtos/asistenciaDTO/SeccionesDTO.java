package Escuela.ReporteAsistencia.dtos.asistenciaDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

public record SeccionesDTO(
        @JsonProperty("id") Long id,
        @JsonProperty("nombre") String nombre,
        @JsonProperty("cupoMaximo") Integer cupoMaximo,
        @JsonProperty("gradoId") Long gradoId,
        @JsonProperty("nombreGrado") String nombreGrado,
        @JsonProperty("docenteId") Long docenteId,
        @JsonProperty("nombreDocente") String nombreDocente,
        @JsonProperty("estudiantesCount") Long estudiantesCount
) {}