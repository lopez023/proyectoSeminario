package Escuela.ReporteAsistencia.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grados")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Grados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreGrado; // Ej: "Primer Grado", "Primer Ingreso"

    private String description;

    // Relación Uno a Muchos: Un grado tiene múltiples secciones (Ej: Sección A, B, C)
    // 'mappedBy' indica que el atributo 'grado' en la entidad Secciones es el dueño de la relación.
    @OneToMany(mappedBy = "grado", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Secciones> secciones = new ArrayList<>();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreGrado() {
        return nombreGrado;
    }

    public void setNombreGrado(String nombreGrado) {
        this.nombreGrado = nombreGrado;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Secciones> getSecciones() {
        return secciones;
    }

    public void setSecciones(List<Secciones> secciones) {
        this.secciones = secciones;
    }
}
