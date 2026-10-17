package Escuela.ReporteAsistencia.securityConfiguration;


import Escuela.ReporteAsistencia.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // 👈 Esto es clave
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        .sessionFixation().none() )



                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()
                       // .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                       // .requestMatchers(HttpMethod.POST, "/api/auth/registro").permitAll()
                       // .requestMatchers("/api/auth/**").permitAll()
                       // .requestMatchers(HttpMethod.POST, "/api/estudiantes").hasRole("ADMINISTRADOR")
                       // .requestMatchers(HttpMethod.GET, "/api/estudiantes").hasRole("ADMINISTRADOR")
                       // .requestMatchers(HttpMethod.GET, "/api/roles/**").hasRole("ADMINISTRADOR")
                      //  .requestMatchers(HttpMethod.POST, "/api/usuarios/**").hasRole("ADMINISTRADOR")
                       // .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasRole("ADMINISTRADOR")



                        .anyRequest().permitAll()
                )

                .securityContext(context ->
                        context.requireExplicitSave(false))

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
