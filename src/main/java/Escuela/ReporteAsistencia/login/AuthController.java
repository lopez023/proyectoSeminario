package Escuela.ReporteAsistencia.login;


import Escuela.ReporteAsistencia.models.Usuarios;
import Escuela.ReporteAsistencia.repositories.UsuarioRepository;
import Escuela.ReporteAsistencia.securityConfiguration.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private  AuthenticationManager authenticationManager;

    @Autowired
    private  UserDetailsService userDetailsService;

    @Autowired
    private  JwtService jwtService;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody Login request) {

        System.out.println("════════════════════════════════════════");
        System.out.println(">>> USERNAME RECIBIDO: [" + request.getUsername() + "]");
        System.out.println(">>> PASSWORD RECIBIDA: [" + request.getContrasenia() + "]");
        System.out.println(">>> AuthenticationManager clase: " + authenticationManager.getClass().getName());
        System.out.println("════════════════════════════════════════");

        log.info(">>> Login intento: usuario={}", request.getUsername());

        // 1. Autenticar (usa tu AuthenticationProvider con BCrypt)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getContrasenia())
        );

        // 2. Cargar el usuario autenticado
        UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());

        // 3. Generar JWT
        String token = jwtService.generarToken(user);
        log.info(">>> Login exitoso, token generado para: {}", user.getUsername());

        return ResponseEntity.ok(new AuthResponse(token));
    }


/*
    @GetMapping("/debug/{username}/{password}")
    public String debug(@PathVariable String username, @PathVariable String password) {
        Usuarios u = usuarioRepository.findByUsername(username).orElse(null);
        if (u == null) return "❌ Usuario no encontrado: " + username;

        boolean coincide = passwordEncoder.matches(password, u.getContrasenia());

        return String.format(
                "✅ Usuario encontrado: %s%n" +
                        "🔑 Hash en BD: %s%n" +
                        "📏 Longitud del hash: %d%n" +
                        "🔐 Contraseña enviada: '%s'%n" +
                        "✔️ ¿Coincide?: %s",
                u.getUsername(),
                u.getContrasenia(),
                u.getContrasenia().length(),
                password,
                coincide
        );
    }*/
}
