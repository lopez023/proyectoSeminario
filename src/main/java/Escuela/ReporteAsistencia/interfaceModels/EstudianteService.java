package Escuela.ReporteAsistencia.interfaceModels;

import Escuela.ReporteAsistencia.dtos.EstudianteDTO;
import Escuela.ReporteAsistencia.mappers.EstudianteMapper;
import Escuela.ReporteAsistencia.models.Estudiantes;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.EstudianteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface EstudianteService {

    public EstudianteDTO crear(EstudianteDTO dto);

    public EstudianteDTO findByCodigoEstudiante(String codigo);

    public List<EstudianteDTO> listar();


    public EstudianteDTO actualizar(String codigo, EstudianteDTO dto);

    public void eliminar(Long id);

    public Long totalEstudiante();


}
