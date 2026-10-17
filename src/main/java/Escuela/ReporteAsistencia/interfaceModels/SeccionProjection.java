package Escuela.ReporteAsistencia.interfaceModels;

import java.util.List;

public interface SeccionProjection {
    Long getId();
    String getNombre();
    Integer getCupoMaximo();

    GradoInfo getGrado();
    DocenteInfo getDocente();
    List<EstudianteInfo> getEstudiantes();

    interface GradoInfo {
        Long getId();
        String getNombreGrado();
        String getDescription();
    }

    interface DocenteInfo {
        Long getId();
        String getNombre();
        String getPrimerApellido();
        String getSegundoApellido();
    }

    interface EstudianteInfo {
        Long getId();
        String getCodigoEstudiante();
        String getNombre();
        String getPrimerApellido();
        String getSegundoApellido();
        Integer getEdad();
        String getTelefonoEncargado();
    }
}