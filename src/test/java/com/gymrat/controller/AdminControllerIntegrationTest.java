package com.gymrat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymrat.model.Role;
import com.gymrat.model.User;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Map;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
public class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User adminUser;

    @BeforeEach
    void setUp() {
        final String ADMIN_USERNAME = "admin";

        if (userRepository.findByUsernameIgnoreCase(ADMIN_USERNAME).isEmpty()) {
            User admin = new User();
            admin.setUsername(ADMIN_USERNAME);
            admin.setPassword(passwordEncoder.encode("adminPassword"));
            admin.setName("System Admin");
            admin.setRole(Role.ADMIN);
            admin.setStrength(100);
            admin.setEndurance(100);
            admin.setFlexibility(100);
            admin.setAccessoryName("None");
            admin.setAccessoryPurchased(false);

            adminUser = userRepository.save(admin);
            System.out.println("✅ Admin user created for testing.");
        } else {
            adminUser = userRepository.findByUsernameIgnoreCase(ADMIN_USERNAME).get();
            System.out.println("ℹ️ Admin user already exists in the system. Skipping creation.");
        }
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldCreateUser() throws Exception {
        Map<String, String> newUser = Map.of(
                "name", "John Doe",
                "username", "johndoe",
                "password", "1234",
                "role", "USER"
        );

        mockMvc.perform(post("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("johndoe"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldGetUserById() throws Exception {
        Long id = adminUser.getId();

        mockMvc.perform(get("/api/admin/users/" + id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldUpdateUserRole() throws Exception {
        Long id = adminUser.getId();
        Map<String, String> roleUpdate = Map.of("role", "USER");

        mockMvc.perform(put("/api/admin/users/" + id + "/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldDeleteUser() throws Exception {
        Long id = adminUser.getId();

        mockMvc.perform(delete("/api/admin/users/" + id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));
    }
}