package Escuela.ReporteAsistencia.dtos.asistenciaDTO;

import java.time.LocalDate;
import java.util.List;

public class RegistroAsistenciaDTO {

    private LocalDate fecha;
    private List<DetalleAsistenciaDTO> detalles;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public List<DetalleAsistenciaDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleAsistenciaDTO> detalles) {
        this.detalles = detalles;
    }
}
