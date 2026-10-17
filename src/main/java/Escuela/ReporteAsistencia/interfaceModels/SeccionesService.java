package Escuela.ReporteAsistencia.interfaceModels;

import Escuela.ReporteAsistencia.dtos.SeccionDTO;
import Escuela.ReporteAsistencia.mappers.SeccionMapper;
import Escuela.ReporteAsistencia.models.Grados;
import Escuela.ReporteAsistencia.models.PerfilDocente;
import Escuela.ReporteAsistencia.models.Secciones;
import Escuela.ReporteAsistencia.repositories.GradoRepository;
import Escuela.ReporteAsistencia.repositories.PerfilDocenteRepository;
import Escuela.ReporteAsistencia.repositories.SeccionesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SeccionesService {

    public SeccionDTO crear(SeccionDTO dto);

    public List<SeccionDTO> listar();

    public SeccionDTO obtenerPorId(Long id);

    public SeccionDTO actualizar(Long id, SeccionDTO dto);

    public void eliminar(Long id);

    public List<SeccionProjection> obtenerSeccionesConEstudiantes();
}
