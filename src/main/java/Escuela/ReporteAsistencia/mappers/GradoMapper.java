package Escuela.ReporteAsistencia.mappers;

import Escuela.ReporteAsistencia.dtos.GradoDTO;
import Escuela.ReporteAsistencia.models.Grados;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GradoMapper {
    GradoDTO toDto(Grados grado);

    List<GradoDTO> toDtoList(List<Grados> grados);

    @Mapping(target = "id", ignore = true)
    Grados toEntity(GradoDTO dto);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(GradoDTO dto, @MappingTarget Grados grado);
}

/*
@Mapper(componentModel = "spring")
public interface GradoMapper {
    GradoDTO toDto(Grados grado);

    List<GradoDTO> toDtoList(List<Grados> grados);

    @Mapping(target = "secciones", ignore = true)
    @Mapping(target = "id", ignore = true)
    Grados toEntity(GradoDTO dto);

    @Mapping(target = "secciones", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(GradoDTO dto, @MappingTarget Grados grado);
}*/
