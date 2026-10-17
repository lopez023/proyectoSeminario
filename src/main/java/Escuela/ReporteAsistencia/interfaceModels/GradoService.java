package Escuela.ReporteAsistencia.interfaceModels;


import Escuela.ReporteAsistencia.dtos.GradoDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GradoService {

    public GradoDTO crear(GradoDTO dto);

    // READ (Todos)
    public List<GradoDTO> listar();
    // READ (Uno por ID)
    public GradoDTO obtenerPorId(Long id);


    public GradoDTO actualizar(Long id, GradoDTO dto);

    public void eliminar(Long id);
}
