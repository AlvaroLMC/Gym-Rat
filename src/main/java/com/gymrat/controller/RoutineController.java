package com.gymrat.controller;

import com.gymrat.dto.CreateRoutineDto;
import com.gymrat.dto.RoutineDto;
import com.gymrat.model.Exercise;
import com.gymrat.model.Routine;
import com.gymrat.model.User;
import com.gymrat.repository.ExerciseRepository;
import com.gymrat.repository.RoutineRepository;
import com.gymrat.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routines")
public class RoutineController {

    private final RoutineRepository routineRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    public RoutineController(RoutineRepository routineRepository,
                             ExerciseRepository exerciseRepository,
                             UserRepository userRepository) {
        this.routineRepository = routineRepository;
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    // 🔹 GET USER'S ROUTINES - Solo USER puede ver sus propias rutinas
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserRoutines(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Routine> routines = routineRepository.findByUserId(user.getId());
            return ResponseEntity.ok(routines);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error fetching routines: " + e.getMessage()
            ));
        }
    }

    // 🔹 GET ROUTINE BY ID - Solo el dueño puede ver su rutina
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getRoutineById(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return routineRepository.findByIdAndUserId(id, user.getId())
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error fetching routine: " + e.getMessage()
            ));
        }
    }

    // 🔹 CREATE ROUTINE - Solo USER puede crear rutinas
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createRoutine(@RequestBody CreateRoutineDto createDto, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validar que los ejercicios existan
            List<Exercise> exercises = new ArrayList<>();
            for (Long exerciseId : createDto.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exerciseId)
                        .orElseThrow(() -> new RuntimeException("Exercise not found: " + exerciseId));
                exercises.add(exercise);
            }

            Routine routine = new Routine();
            routine.setName(createDto.getName());
            routine.setUser(user);
            routine.setExercises(exercises);

            Routine savedRoutine = routineRepository.save(routine);
            return ResponseEntity.ok(savedRoutine);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error creating routine: " + e.getMessage()
            ));
        }
    }

    // 🔹 UPDATE ROUTINE - Solo el dueño puede actualizar su rutina
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateRoutine(@PathVariable Long id,
                                           @RequestBody CreateRoutineDto createDto,
                                           Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return routineRepository.findByIdAndUserId(id, user.getId())
                    .map(routine -> {
                        routine.setName(createDto.getName());

                        // Actualizar ejercicios
                        List<Exercise> exercises = new ArrayList<>();
                        for (Long exerciseId : createDto.getExercises()) {
                            exerciseRepository.findById(exerciseId).ifPresent(exercises::add);
                        }
                        routine.setExercises(exercises);

                        return ResponseEntity.ok(routineRepository.save(routine));
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error updating routine: " + e.getMessage()
            ));
        }
    }

    // 🔹 DELETE ROUTINE - Solo el dueño puede eliminar su rutina
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteRoutine(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return routineRepository.findByIdAndUserId(id, user.getId())
                    .map(routine -> {
                        routineRepository.delete(routine);
                        return ResponseEntity.ok(Map.of("message", "Routine deleted successfully"));
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error deleting routine: " + e.getMessage()
            ));
        }
    }
}
