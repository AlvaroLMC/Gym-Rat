package com.gymrat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymrat.dto.CreateRoutineDto;
import com.gymrat.model.Exercise;
import com.gymrat.model.Role;
import com.gymrat.model.Routine;
import com.gymrat.model.User;
import com.gymrat.repository.ExerciseRepository;
import com.gymrat.repository.RoutineRepository;
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
class RoutineControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private ObjectMapper objectMapper;


    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    private Exercise exercise1;
    private Exercise exercise2;

    @BeforeEach
    void setUp() {
        routineRepository.deleteAll();
        userRepository.deleteAll();
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

        exercise1 = new Exercise();
        exercise1.setName("Push Ups");
        exercise1.setDescription("Chest exercise");
        exercise1.setCategory("Strength");
        exercise1.setStrengthImpact(5);
        exercise1.setEnduranceImpact(2);
        exercise1.setFlexibilityImpact(1);
        exercise1 = exerciseRepository.save(exercise1);

        exercise2 = new Exercise();
        exercise2.setName("Squats");
        exercise2.setDescription("Leg exercise");
        exercise2.setCategory("Strength");
        exercise2.setStrengthImpact(6);
        exercise2.setEnduranceImpact(3);
        exercise2.setFlexibilityImpact(2);
        exercise2 = exerciseRepository.save(exercise2);
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldCreateRoutine() throws Exception {
        CreateRoutineDto dto = new CreateRoutineDto();
        dto.setName("Morning Routine");
        dto.setExercises(List.of(exercise1.getId(), exercise2.getId()));

        mockMvc.perform(post("/api/routines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Morning Routine"))
                .andExpect(jsonPath("$.exercises.length()").value(2));

        assertThat(routineRepository.findAll()).hasSize(1);
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldGetUserRoutines() throws Exception {
        // Crear rutina asociada al usuario
        Routine routine = new Routine();
        routine.setName("Evening Routine");
        routine.setUser(testUser);
        routine.setExercises(List.of(exercise1, exercise2));
        routineRepository.save(routine);

        mockMvc.perform(get("/api/routines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Evening Routine"))
                .andExpect(jsonPath("$[0].exercises.length()").value(2));
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldUpdateRoutine() throws Exception {
        Routine routine = new Routine();
        routine.setName("Old Routine");
        routine.setUser(testUser);
        routine.setExercises(List.of(exercise1));
        routineRepository.save(routine);

        CreateRoutineDto updateDto = new CreateRoutineDto();
        updateDto.setName("Updated Routine");
        updateDto.setExercises(List.of(exercise2.getId()));

        mockMvc.perform(put("/api/routines/" + routine.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Routine"))
                .andExpect(jsonPath("$.exercises.length()").value(1));
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldDeleteRoutine() throws Exception {
        Routine routine = new Routine();
        routine.setName("To Delete");
        routine.setUser(testUser);
        routine.setExercises(List.of(exercise1));
        routineRepository.save(routine);

        mockMvc.perform(delete("/api/routines/" + routine.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Routine deleted successfully"));

        assertThat(routineRepository.existsById(routine.getId())).isFalse();
    }
}
