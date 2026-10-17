package Escuela.ReporteAsistencia.interfaceModels;

import Escuela.ReporteAsistencia.dtos.UsuarioDTO;

import java.util.List;
import java.util.Optional;

public interface UsuariosService {

    public UsuarioDTO crear(UsuarioDTO dto);

    public List<UsuarioDTO> listar();

    // READ (Uno por ID)
    public UsuarioDTO obtenerPorId(Long id);
    public UsuarioDTO actualizar(Long id, UsuarioDTO dto);


    public void eliminar(Long id);

    public String obtenerNombre(String usuario);

    public UsuarioDTO obtenerPorusuario(String dto);
}
