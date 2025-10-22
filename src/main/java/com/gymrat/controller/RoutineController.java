package com.gymrat.controller;

import com.gymrat.dto.CreateRoutineDto;
import com.gymrat.dto.ExerciseDto;
import com.gymrat.dto.RoutineDto;
import com.gymrat.model.Exercise;
import com.gymrat.model.Routine;
import com.gymrat.model.User;
import com.gymrat.repository.ExerciseRepository;
import com.gymrat.repository.RoutineRepository;
import com.gymrat.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routines")
public class RoutineController {

    private static final Logger logger = LoggerFactory.getLogger(RoutineController.class);
    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserRoutines(Authentication authentication) {
        String username = authentication.getName();
        logger.info("GET /api/routines - Usuario: {}", username);

        try {
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            logger.debug("Usuario encontrado: ID={}, Username={}", user.getId(), user.getUsername());

            List<Routine> routines = routineRepository.findByUserId(user.getId());
            logger.debug("Rutinas encontradas: {} rutinas para usuario {}", routines.size(), username);

            List<RoutineDto> routineDtos = routines.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            logger.info("GET /api/routines - Éxito: {} rutinas devueltas para {}", routineDtos.size(), username);
            return ResponseEntity.ok(routineDtos);

        } catch (Exception e) {
            logger.error("GET /api/routines - Error al obtener rutinas para usuario {}: {}", username, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error fetching routines: " + e.getMessage()
            ));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    public ResponseEntity<?> createRoutine(@RequestBody CreateRoutineDto createDto, Authentication authentication) {
        String username = authentication.getName();
        logger.info("POST /api/routines - Usuario: {}, Rutina: {}", username, createDto.getName());

        try {
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            logger.debug("Creando rutina '{}' con {} ejercicios", createDto.getName(), createDto.getExercises().size());

            Routine routine = new Routine();
            routine.setName(createDto.getName());
            routine.setUser(user);

            List<Exercise> exercises = new ArrayList<>();
            for (Long exerciseId : createDto.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exerciseId)
                        .orElseThrow(() -> new RuntimeException("Exercise not found: " + exerciseId));
                exercises.add(exercise);
                logger.debug("Ejercicio agregado: ID={}, Nombre={}", exercise.getId(), exercise.getName());
            }
            routine.setExercises(exercises);

            Routine savedRoutine = routineRepository.save(routine);

            auditLogger.info("ROUTINE_CREATED - Usuario: {}, Rutina ID: {}, Nombre: {}, Ejercicios: {}",
                    username, savedRoutine.getId(), savedRoutine.getName(), createDto.getExercises().size());

            logger.info("POST /api/routines - Éxito: Rutina '{}' creada con ID={}", savedRoutine.getName(), savedRoutine.getId());
            return ResponseEntity.ok(convertToDto(savedRoutine));

        } catch (Exception e) {
            logger.error("POST /api/routines - Error al crear rutina para usuario {}: {}", username, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error creating routine: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    public ResponseEntity<?> updateRoutine(@PathVariable Long id, @RequestBody CreateRoutineDto updateDto, Authentication authentication) {
        String username = authentication.getName();
        logger.info("PUT /api/routines/{} - Usuario: {}, Nueva nombre: {}", id, username, updateDto.getName());

        try {
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Routine routine = routineRepository.findByIdAndUserId(id, user.getId())
                    .orElseThrow(() -> new RuntimeException("Routine not found or access denied"));

            String oldName = routine.getName();
            routine.setName(updateDto.getName());

            List<Exercise> exercises = new ArrayList<>();
            for (Long exerciseId : updateDto.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exerciseId)
                        .orElseThrow(() -> new RuntimeException("Exercise not found: " + exerciseId));
                exercises.add(exercise);
            }
            routine.setExercises(exercises);

            Routine updatedRoutine = routineRepository.save(routine);

            auditLogger.info("ROUTINE_UPDATED - Usuario: {}, Rutina ID: {}, Nombre anterior: {}, Nombre nuevo: {}",
                    username, id, oldName, updateDto.getName());

            logger.info("PUT /api/routines/{} - Éxito: Rutina actualizada", id);
            return ResponseEntity.ok(convertToDto(updatedRoutine));

        } catch (Exception e) {
            logger.error("PUT /api/routines/{} - Error al actualizar rutina: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error updating routine: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteRoutine(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        logger.info("DELETE /api/routines/{} - Usuario: {}", id, username);

        try {
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Routine routine = routineRepository.findByIdAndUserId(id, user.getId())
                    .orElseThrow(() -> new RuntimeException("Routine not found or access denied"));

            String routineName = routine.getName();
            routineRepository.delete(routine);

            auditLogger.info("ROUTINE_DELETED - Usuario: {}, Rutina ID: {}, Nombre: {}",
                    username, id, routineName);

            logger.info("DELETE /api/routines/{} - Éxito: Rutina '{}' eliminada", id, routineName);
            return ResponseEntity.ok(Map.of("message", "Routine deleted successfully"));

        } catch (Exception e) {
            logger.error("DELETE /api/routines/{} - Error al eliminar rutina: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error deleting routine: " + e.getMessage()
            ));
        }
    }

    private RoutineDto convertToDto(Routine routine) {
        RoutineDto dto = new RoutineDto();
        dto.setId(routine.getId());
        dto.setName(routine.getName());

        List<ExerciseDto> exerciseDtos = routine.getExercises().stream()
                .map(exercise -> {
                    ExerciseDto exDto = new ExerciseDto();
                    exDto.setId(exercise.getId());
                    exDto.setName(exercise.getName());
                    exDto.setDescription(exercise.getDescription());
                    exDto.setCategory(exercise.getCategory());
                    exDto.setEnduranceImpact(exercise.getEnduranceImpact());
                    exDto.setStrengthImpact(exercise.getStrengthImpact());
                    exDto.setFlexibilityImpact(exercise.getFlexibilityImpact());
                    return exDto;
                })
                .collect(Collectors.toList());

        dto.setExercises(exerciseDtos);
        return dto;
    }
}