package Escuela.ReporteAsistencia.mappers;

import Escuela.ReporteAsistencia.dtos.SeccionDTO;
import Escuela.ReporteAsistencia.models.Secciones;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SeccionMapper {
    @Mapping(source = "grado.id", target = "gradoId")
    @Mapping(source = "grado.nombreGrado", target = "nombreGrado")
    @Mapping(source = "docente.id", target = "docenteId")
    @Mapping(source = "docente.nombre", target = "nombreDocente")
    SeccionDTO toDto(Secciones seccion);

    List<SeccionDTO> toDtoList(List<Secciones> secciones);

    @Mapping(target = "grado", ignore = true)
    @Mapping(target = "docente", ignore = true)
    @Mapping(target = "estudiantes", ignore = true)
    @Mapping(target = "id", ignore = true)
    Secciones toEntity(SeccionDTO dto);

    @Mapping(target = "grado", ignore = true)
    @Mapping(target = "docente", ignore = true)
    @Mapping(target = "estudiantes", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(SeccionDTO dto, @MappingTarget Secciones seccion);
}

/*

@Mapper(componentModel = "spring")
public interface SeccionMapper {
    @Mapping(source = "grado.id", target = "gradoId")
    @Mapping(source = "grado.nombreGrado", target = "nombreGrado")
    @Mapping(source = "docente.id", target = "docenteId")
    // Asumiendo que PerfilDocente tiene un campo 'nombre' o 'nombreCompleto'
    @Mapping(source = "docente.nombre", target = "nombreDocente")
    SeccionDTO toDto(Secciones seccion);

    List<SeccionDTO> toDtoList(List<Secciones> secciones);

    @Mapping(target = "grado", ignore = true)
    @Mapping(target = "docente", ignore = true)
    @Mapping(target = "estudiantes", ignore = true)
    @Mapping(target = "id", ignore = true)
    Secciones toEntity(SeccionDTO dto);

    @Mapping(target = "grado", ignore = true)
    @Mapping(target = "docente", ignore = true)
    @Mapping(target = "estudiantes", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(SeccionDTO dto, @MappingTarget Secciones seccion);
}
*/