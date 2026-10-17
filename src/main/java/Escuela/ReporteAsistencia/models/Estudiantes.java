package Escuela.ReporteAsistencia.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Estudiantes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class  Estudiantes{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String primerApellido;

    private String segundoApellido;

    private String telefonoEncargado;

    private Integer edad;

    private LocalDate fechaNacimiento;

   // private Asistencias asistencia;

    private String codigoEstudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    @JsonIgnore
    private Secciones seccion;


    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Asistencias> asistencias = new ArrayList<>();


    public void addAsistencia(Asistencias asistencia) {
        asistencias.add(asistencia);
        asistencia.setEstudiante(this);
    }

    public void removeAsistencia(Asistencias asistencia) {
        asistencias.remove(asistencia);
        asistencia.setEstudiante(null);
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public String getTelefonoEncargado() {
        return telefonoEncargado;
    }

    public void setTelefonoEncargado(String telefonoEncargado) {
        this.telefonoEncargado = telefonoEncargado;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    /*public Asistencias getAsistencia() {
        return asistencia;
    }*/

   /* public void setAsistencia(Asistencias asistencia) {
        this.asistencia = asistencia;
    }*/

    public String getCodigoEstudiante() {
        return codigoEstudiante;
    }

    public void setCodigoEstudiante(String codigoEstudiante) {
        this.codigoEstudiante = codigoEstudiante;
    }

    public Secciones getSeccion() {
        return seccion;
    }

    public void setSeccion(Secciones seccion) {
        this.seccion = seccion;
    }

    public List<Asistencias> getAsistencias() {
        return asistencias;
    }

    public void setAsistencias(List<Asistencias> asistencias) {
        this.asistencias = asistencias;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }
}
