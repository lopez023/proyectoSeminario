package Escuela.ReporteAsistencia.mappers;

import Escuela.ReporteAsistencia.dtos.PerfilDocenteDTO;
import Escuela.ReporteAsistencia.models.PerfilDocente;
import Escuela.ReporteAsistencia.models.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PerfilDocenteMapper {

    @Mapping(source = "usuario.id", target = "usuarioId")
    @Mapping(source = "usuario.roles", target = "roles")
    PerfilDocenteDTO toDto(PerfilDocente docente);

    List<PerfilDocenteDTO> toDtoList(List<PerfilDocente> docentes);

    default Set<String> mapRoles(Set<Rol> roles) {
        if (roles == null) return Set.of();
        return roles.stream()
                .map(Rol::getRol)
                .collect(Collectors.toSet());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "secciones", ignore = true)
    @Mapping(target = "edad", ignore = true)
    PerfilDocente toEntity(PerfilDocenteDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "secciones", ignore = true)
    @Mapping(target = "edad", ignore = true)
    void updateEntityFromDto(PerfilDocenteDTO dto, @MappingTarget PerfilDocente docente);
}