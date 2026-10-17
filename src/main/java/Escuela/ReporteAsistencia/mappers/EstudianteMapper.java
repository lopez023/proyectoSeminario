package Escuela.ReporteAsistencia.mappers;


import Escuela.ReporteAsistencia.dtos.EstudianteDTO;
import Escuela.ReporteAsistencia.models.Estudiantes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring")
public interface EstudianteMapper {

    @Mapping(source = "seccion.id", target = "seccionId")
    @Mapping(source = "seccion.nombre", target = "nombreSeccion")
    @Mapping(source = "seccion.grado.id", target = "gradoId")
    @Mapping(source = "seccion.grado.nombreGrado", target = "nombreGrado")
    EstudianteDTO toDto(Estudiantes estudiante);

    List<EstudianteDTO> toDtoList(List<Estudiantes> estudiantes);

    // Ignoramos los campos que vas a procesar a mano en el Service
    @Mapping(target = "seccion", ignore = true)
    @Mapping(target = "asistencias", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "codigoEstudiante", ignore = true) // 👈 Ignorado para manejar en el Service
    @Mapping(target = "edad", ignore = true)
    Estudiantes toEntity(EstudianteDTO dto);

    @Mapping(target = "seccion", ignore = true)
    @Mapping(target = "asistencias", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "codigoEstudiante", ignore = true) // 👈 Ignorado para manejar en el Service
    void updateEntityFromDto(EstudianteDTO dto, @MappingTarget Estudiantes estudiante);
}
