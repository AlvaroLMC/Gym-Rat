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
            if (!userRepository.existsByRole(Role.ADMIN)) {
                User admin = new User();
                admin.setName("Administrador");
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("12345678"));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
                System.out.println("✅ Administrador creado exitosamente");
            } else {
                System.out.println("ℹ️  El administrador ya existe en el sistema");
            }
        };
    }
}
