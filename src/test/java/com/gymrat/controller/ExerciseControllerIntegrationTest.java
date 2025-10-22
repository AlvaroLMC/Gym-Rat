package com.gymrat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymrat.dto.ExerciseDto;
import com.gymrat.model.Exercise;
import com.gymrat.model.Role;
import com.gymrat.model.User;
import com.gymrat.repository.ExerciseRepository;
import com.gymrat.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
class ExerciseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;


    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setup() {
        exerciseRepository.deleteAll();

        testUser = new User();
        testUser.setUsername("johndoe");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setName("John Doe");
        testUser.setRole(Role.USER);
        testUser.setStrength(10);
        testUser.setEndurance(8);
        testUser.setFlexibility(6);
        testUser.setAccessoryName("None");
        testUser.setAccessoryPurchased(false);
        testUser = userRepository.save(testUser);

    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldGetAllExercises() throws Exception {
        Exercise ex1 = new Exercise(null, "Push Ups", "Chest exercise", "Strength", 5, 2, 1);
        Exercise ex2 = new Exercise(null, "Squats", "Legs exercise", "Strength", 6, 3, 2);
        exerciseRepository.saveAll(List.of(ex1, ex2));

        mockMvc.perform(get("/api/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Push Ups"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateExercise() throws Exception {
        ExerciseDto dto = new ExerciseDto();
        dto.setName("Plank");
        dto.setDescription("Core stability exercise");
        dto.setCategory("Endurance");
        dto.setStrengthImpact(1);
        dto.setEnduranceImpact(5);
        dto.setFlexibilityImpact(2);

        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Plank"));

        assertThat(exerciseRepository.findAll()).hasSize(1);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldUpdateExercise() throws Exception {
        Exercise saved = exerciseRepository.save(
                new Exercise(null, "Burpees", "Full body exercise", "Cardio", 4, 5, 3)
        );

        ExerciseDto updateDto = new ExerciseDto();
        updateDto.setName("Advanced Burpees");
        updateDto.setDescription("Updated description");
        updateDto.setCategory("Cardio");
        updateDto.setStrengthImpact(5);
        updateDto.setEnduranceImpact(5);
        updateDto.setFlexibilityImpact(3);

        mockMvc.perform(put("/api/exercises/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Advanced Burpees"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldDeleteExercise() throws Exception {
        Exercise saved = exerciseRepository.save(
                new Exercise(null, "Jumping Jacks", "Warm-up exercise", "Cardio", 2, 4, 3)
        );

        mockMvc.perform(delete("/api/exercises/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Exercise deleted successfully"));

        assertThat(exerciseRepository.existsById(saved.getId())).isFalse();
    }
}
