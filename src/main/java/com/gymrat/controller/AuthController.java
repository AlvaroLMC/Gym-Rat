package com.gymrat.controller;

import com.gymrat.dto.LoginDto;
import com.gymrat.dto.RegisterDto;
import com.gymrat.model.Role;
import com.gymrat.model.User;
import com.gymrat.repository.UserRepository;
import com.gymrat.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        logger.info("Attempting login for user: {}", loginDto.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );
            logger.debug("Authentication successful for user: {}", loginDto.getUsername());

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            User user = userRepository.findByUsernameIgnoreCase(loginDto.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            logger.info("Login successful. JWT token generated for user ID: {}", user.getId());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "id", user.getId(),
                    "username", userDetails.getUsername(),
                    "role", userDetails.getAuthorities().iterator().next().getAuthority()
            ));
        } catch (Exception e) {
            logger.error("Login failed for user: {}. Reason: {}", loginDto.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "timestamp", LocalDateTime.now(),
                            "status", 401,
                            "message", "Credenciales inválidas"
                    ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        logger.info("Attempting registration for new user: {}", registerDto.getUsername());
        try {
            // Verificar si el usuario ya existe
            if (userRepository.findByUsernameIgnoreCase(registerDto.getUsername()).isPresent()) {
                logger.warn("Registration failed: Username already in use: {}", registerDto.getUsername());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", 409,
                                "message", "El nombre de usuario ya está en uso"
                        ));
            }
            logger.debug("Username {} is available.", registerDto.getUsername());

            // Crear nuevo usuario
            User user = new User();
            user.setName(registerDto.getName());
            user.setUsername(registerDto.getUsername());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
            user.setRole(Role.USER);

            User savedUser = userRepository.save(user);

            // Generar token JWT
            UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
            String token = jwtUtil.generateToken(userDetails);

            logger.info("Registration successful. New user ID: {}", savedUser.getId());

            return ResponseEntity.ok(Map.of(
                    "id", savedUser.getId(),
                    "username", savedUser.getUsername(),
                    "name", savedUser.getName(),
                    "role", savedUser.getRole(),
                    "token", token
            ));
        } catch (Exception e) {
            logger.error("Error occurred during registration for user {}: {}", registerDto.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "timestamp", LocalDateTime.now(),
                            "status", 500,
                            "message", "Error al crear la cuenta: " + e.getMessage()
                    ));
        }
    }
}
