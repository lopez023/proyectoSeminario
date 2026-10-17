package Escuela.ReporteAsistencia.interfaceModels;

import Escuela.ReporteAsistencia.dtos.RolDTO;

import java.util.List;

public interface RolService {

    public RolDTO crear(RolDTO dto);

    public List<RolDTO> listar();

    public RolDTO obtenerPorId(Long id);

    public RolDTO actualizar(Long id, RolDTO dto);


    public void eliminar(Long id);
}
