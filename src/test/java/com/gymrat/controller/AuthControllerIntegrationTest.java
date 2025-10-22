package com.gymrat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymrat.dto.LoginDto;
import com.gymrat.dto.RegisterDto;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
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
    void shouldRegisterNewUser() throws Exception {
        RegisterDto registerDto = new RegisterDto("Alvaro Mendoza", "Alvaro", "Alvaro1234");
        registerDto.setName("New User");
        registerDto.setUsername("newuser");
        registerDto.setPassword("newpassword");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldRejectDuplicateUsernameOnRegister() throws Exception {
        RegisterDto registerDto = new RegisterDto("Alvaro Mendoza", "johndoe", "Alvaro1234");
        registerDto.setName("Duplicate");
        registerDto.setUsername("johndoe"); // ya existe
        registerDto.setPassword("password");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("El nombre de usuario ya está en uso"));
    }

    @Test
    @WithMockUser(username = "johndoe", roles = {"USER"})
    void shouldLoginSuccessfully() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setUsername("johndoe");
        loginDto.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("johndoe"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }

    @Test
    void shouldFailLoginWithWrongPassword() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setUsername("testuser");
        loginDto.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciales inválidas"));
    }
}
