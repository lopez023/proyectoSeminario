package Escuela.ReporteAsistencia.securityConfiguration;

import Escuela.ReporteAsistencia.models.Usuarios;
import Escuela.ReporteAsistencia.repositories.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {
    private final UsuarioRepository usuarioRepository;

    public ApplicationConfig(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {

        //return username -> {
      //      System.out.println("════════════════════════════════════════");
          //  System.out.println(">>> USERDETAILSSERVICE LLAMADO con username: [" + username + "]");

        //    Usuarios u = usuarioRepository.findByUsername(username)
      //              .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

          /*  System.out.println(">>> USUARIO ENCONTRADO: " + u.getUsername());
            System.out.println(">>> HASH EN BD: " + u.getContrasenia());
            System.out.println(">>> LONGITUD HASH: " + u.getContrasenia().length());
            System.out.println(">>> AUTHORITIES: " + u.getAuthorities());
            System.out.println("════════════════════════════════════════");*/


            return username -> {
                Usuarios u = usuarioRepository.findByUsernameWithRoles(username)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

                System.out.println(">>> USUARIO ENCONTRADO: " + u.getUsername());
                System.out.println(">>> AUTHORITIES: " + u.getAuthorities());

                return u;
            };


         //   return u;

        /*
        return username -> usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));*/
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService());

    //    provider.setUserDetailsService(userDetailsService());
   //     provider.setPasswordEncoder(passwordEncoder());

        PasswordEncoder encoder = passwordEncoder();

        System.out.println("════════════════════════════════════════");
        System.out.println(">>> PROVIDER CREADO");
        System.out.println(">>> ENCODER CLASE: " + encoder.getClass().getName());
        System.out.println(">>> ENCODER HASH DE PRUEBA: " + encoder.encode("test"));
        System.out.println("════════════════════════════════════════");

        provider.setPasswordEncoder(encoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }
}
