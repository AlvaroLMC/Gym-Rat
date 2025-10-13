package com.gymrat.config;

import com.gymrat.model.Role;
import com.gymrat.model.User;
import com.gymrat.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Verificar si ya existe un administrador
            if (!userRepository.existsByRole(Role.ADMIN)) {
                // Crear el administrador por defecto
                User admin = new User();
                admin.setName("Administrador");
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("12345678"));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
                System.out.println("✅ Administrador creado exitosamente");
                System.out.println("   Username: admin");
                System.out.println("   Password: 12345678");
                System.out.println("   ⚠️  IMPORTANTE: Cambia esta contraseña después del primer login");
            } else {
                System.out.println("ℹ️  El administrador ya existe en el sistema");
            }
        };
    }
}
