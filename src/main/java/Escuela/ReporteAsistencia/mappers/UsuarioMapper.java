package Escuela.ReporteAsistencia.mappers;


import Escuela.ReporteAsistencia.dtos.UsuarioDTO;
import Escuela.ReporteAsistencia.models.Usuarios;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {


    // ============================================
    // ENTIDAD -> DTO (Respuesta al cliente)
    // ============================================
    @Mapping(target = "contrasenia", ignore = true) // 🔒 NUNCA exponer la contraseña
    @Mapping(target = "roles", expression = "java(usuario.getRoles() != null ? usuario.getRoles().stream().map(r -> r.getRol()).collect(java.util.stream.Collectors.toSet()) : new java.util.HashSet<>())")
    UsuarioDTO toDto(Usuarios usuario);

    List<UsuarioDTO> toDtoList(List<Usuarios> usuarios);

    // ============================================
    // DTO -> ENTIDAD (Registro nuevo)
    // ============================================
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "perfil", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "contrasenia", ignore = true) // 🔒 Se encripta manualmente en el servicio
    @Mapping(target = "fechaCreacion", ignore = true) // 📅 Se asigna en el servicio
    Usuarios toEntity(UsuarioDTO dto);

    // ============================================
    // ACTUALIZAR ENTIDAD EXISTENTE
    // ============================================
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "perfil", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "contrasenia", ignore = true) // 🔒 No sobrescribir con la del DTO
    @Mapping(target = "fechaCreacion", ignore = true) // 📅 No modificar la original
    void updateEntityFromDto(UsuarioDTO dto, @MappingTarget Usuarios usuario);
}
