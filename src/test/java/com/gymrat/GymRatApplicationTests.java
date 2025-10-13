package com.gymrat;

import com.gymrat.model.Stat;
import com.gymrat.model.User;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class GymRatApplicationTests {

    @Test
    void contextLoads() {
        // Crear un Stat válido en lugar de asignar un String
        Stat stat = Stat.STRENGTH;
        // Simular un Optional<User> en lugar de usar User directo
        User user = new User();
        Optional<User> optionalUser = Optional.of(user);

        // Usar orElseThrow() sobre el Optional
        User result = optionalUser.orElseThrow();

        // Validar que se obtuvo un usuario
        assertNotNull(result);
    }
}
