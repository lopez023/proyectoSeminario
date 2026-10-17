package Escuela.ReporteAsistencia.mappers;

import Escuela.ReporteAsistencia.dtos.RolDTO;
import Escuela.ReporteAsistencia.models.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring")
public interface RolMapper {

    // Mapeo explícito usando 'entidadRol' como parámetro para evitar colisiones de nombres
    @Mapping(source = "id", target = "id")
    @Mapping(source = "rol", target = "rol")
    RolDTO toDto(Rol entidadRol);

    List<RolDTO> toDtoList(List<Rol> roles);

    @Mapping(target = "usuarios", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "rol", target = "rol")
    Rol toEntity(RolDTO dto);

    @Mapping(target = "usuarios", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "rol", target = "rol")
    void updateEntityFromDto(RolDTO dto, @MappingTarget Rol entidadRol);
}
