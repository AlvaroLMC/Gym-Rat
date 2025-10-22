package com.gymrat.controller;

import com.gymrat.dto.UserDto;
import com.gymrat.model.Role;
import com.gymrat.model.User;
import com.gymrat.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        logger.info("ADMIN request: Fetching all users.");
        try {
            List<User> users = userRepository.findAll();
            List<UserDto> userDtos = users.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            logger.debug("Successfully fetched {} users.", users.size());
            return ResponseEntity.ok(userDtos);
        } catch (Exception e) {
            logger.error("Error fetching all users: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error fetching users: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        logger.info("ADMIN request: Creating new user: {}", username);
        try {
            if (userRepository.existsByUsernameIgnoreCase(username)) {
                logger.warn("Creation failed: Username {} already exists.", username);
                return ResponseEntity.badRequest().body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "message", "Username already exists"
                ));
            }

            User user = new User();
            user.setName(userData.get("name"));
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(userData.get("password")));

            // Convertir String a enum Role
            String roleStr = userData.getOrDefault("role", "USER");
            user.setRole(Role.valueOf(roleStr)); // USER o ADMIN

            user.setStrength(0);
            user.setEndurance(0);
            user.setFlexibility(0);
            user.setAccessoryPurchased(false);

            User savedUser = userRepository.save(user);
            logger.info("Successfully created new user with ID: {} and role: {}", savedUser.getId(), roleStr);
            return ResponseEntity.ok(convertToDto(savedUser));
        } catch (Exception e) {
            logger.error("Error creating user {}: {}", username, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error creating user: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> userData) {
        logger.info("ADMIN request: Updating user ID: {}", id);
        try {
            return userRepository.findById(id)
                    .map(user -> {
                        logger.debug("Applying updates to user {}: {}", id, userData.keySet());
                        if (userData.containsKey("name")) {
                            user.setName(userData.get("name"));
                        }
                        if (userData.containsKey("username")) {
                            user.setUsername(userData.get("username"));
                        }
                        if (userData.containsKey("role")) {
                            user.setRole(Role.valueOf(userData.get("role")));
                            logger.info("Role updated for user {} to {}", id, userData.get("role"));
                        }
                        User updatedUser = userRepository.save(user);
                        logger.info("User {} successfully updated.", id);
                        return ResponseEntity.ok(convertToDto(updatedUser));
                    })
                    .orElseGet(() -> {
                        logger.warn("Update failed: User not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error updating user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error updating user: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        logger.warn("ADMIN request: Attempting to delete user ID: {}", id);
        try {
            if (!userRepository.existsById(id)) {
                logger.warn("Deletion failed: User not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
            userRepository.deleteById(id);
            logger.info("User {} successfully deleted.", id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error deleting user: " + e.getMessage()
            ));
        }
    }



    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestBody Map<String, String> data) {
        String newRole = data.get("role");
        logger.warn("ADMIN request: Changing role for user {} to {}", id, newRole);
        try {
            return userRepository.findById(id)
                    .map(user -> {
                        user.setRole(Role.valueOf(newRole)); // Convertir String a enum
                        User updatedUser = userRepository.save(user);
                        logger.info("Role successfully changed for user {} to {}", id, newRole);
                        return ResponseEntity.ok(convertToDto(updatedUser));
                    })
                    .orElseGet(() -> {
                        logger.warn("Role change failed: User not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error changing role for user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error changing role: " + e.getMessage()
            ));
        }
    }




    @PutMapping("/users/{id}/password")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long id, @RequestBody Map<String, String> data) {
        logger.warn("ADMIN request: Resetting password for user ID: {}", id);
        try {
            String newPassword = data.get("password");
            return userRepository.findById(id)
                    .map(user -> {
                        user.setPassword(passwordEncoder.encode(newPassword));
                        userRepository.save(user);
                        logger.info("Password successfully reset for user ID: {}", id);
                        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
                    })
                    .orElseGet(() -> {
                        logger.warn("Password reset failed: User not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error resetting password for user {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error resetting password: " + e.getMessage()
            ));
        }
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().name());
        dto.setStrength(user.getStrength());
        dto.setEndurance(user.getEndurance());
        dto.setFlexibility(user.getFlexibility());
        dto.setAccessoryPurchased(user.isAccessoryPurchased());
        dto.setAccessoryName(user.getAccessoryName());
        return dto;
    }
}
