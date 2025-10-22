package com.gymrat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymrat.dto.*;
import com.gymrat.model.*;
import com.gymrat.repository.AccessoryRepository;
import com.gymrat.repository.TrainingSessionRepository;
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
class GymControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccessoryRepository accessoryRepository;

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setup() {
        sessionRepository.deleteAll();
        accessoryRepository.deleteAll();
        userRepository.deleteAll();

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
    void testTrainEndpoint_shouldIncreaseStat() throws Exception {
        TrainDto dto = new TrainDto();
        dto.setStat(Stat.STRENGTH);
        dto.setAmount(5);
        mockMvc.perform(post("/api/users/" + testUser.getId() + "/train")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.strength").value(15));

        User updated = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updated.getStrength()).isEqualTo(15);
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void testRestEndpoint_shouldDecreaseStats() throws Exception {
        RestDto dto = new RestDto();
        dto.setAmount(4);

        mockMvc.perform(post("/api/users/" + testUser.getId() + "/rest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.strength").value(6))
                .andExpect(jsonPath("$.endurance").value(4))
                .andExpect(jsonPath("$.flexibility").value(2));

        User updated = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updated.getStrength()).isEqualTo(6);
        assertThat(updated.getEndurance()).isEqualTo(4);
        assertThat(updated.getFlexibility()).isEqualTo(2);
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void testPurchaseEndpoint_shouldDecreaseCoinsAndAddAccessory() throws Exception {
        testUser.setStrength(100);
        testUser.setEndurance(100);
        testUser.setFlexibility(100);
        userRepository.save(testUser);

        PurchaseDto dto = new PurchaseDto();
        dto.setAccessoryName("Jump Rope");

        mockMvc.perform(post("/api/users/" + testUser.getId() + "/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Jump Rope"));

        User updated = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updated.getAccessoryName()).isEqualTo("Jump Rope");
        assertThat(updated.isAccessoryPurchased()).isTrue();
    }

    // 🔹 4. /api/users/{id} (GET)
    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void testGetUserEndpoint_shouldReturnUserDetails() throws Exception {
        mockMvc.perform(get("/api/users/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.strength").value(10));
    }

    // 🔹 5. /api/users/{id}/sessions (POST)
    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void testAddSessionEndpoint_shouldCreateNewSession() throws Exception {
        SessionDto dto = new SessionDto();
        dto.setDescription("Morning cardio");

        mockMvc.perform(post("/api/users/" + testUser.getId() + "/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Morning cardio"));

        List<TrainingSession> sessions = sessionRepository.findAll();
        assertThat(sessions).hasSize(1);
        assertThat(sessions.get(0).getDescription()).isEqualTo("Morning cardio");
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void testGetSessionsEndpoint_shouldReturnListOfSessions() throws Exception {
        TrainingSession session = new TrainingSession();
        session.setDescription("Afternoon HIIT");
        session.setUser(testUser);
        sessionRepository.save(session);

        mockMvc.perform(get("/api/users/" + testUser.getId() + "/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Afternoon HIIT"));
    }
}