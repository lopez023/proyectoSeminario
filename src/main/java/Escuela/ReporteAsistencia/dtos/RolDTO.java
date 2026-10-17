package Escuela.ReporteAsistencia.dtos;

public class RolDTO {
    private Long id;
    private String rol;

    public RolDTO() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
