package Escuela.ReporteAsistencia.interfaceModels;

import Escuela.ReporteAsistencia.dtos.PerfilDocenteDTO;

import java.util.List;

public interface PerfilDocenteService {

    public PerfilDocenteDTO crear(PerfilDocenteDTO dto);


    public List<PerfilDocenteDTO> listar();


    public PerfilDocenteDTO obtenerPorId(Long id);


    public PerfilDocenteDTO actualizar(Long id, PerfilDocenteDTO dto);


    public void eliminar(Long id);

}
