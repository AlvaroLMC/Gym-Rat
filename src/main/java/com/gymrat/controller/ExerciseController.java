package com.gymrat.controller;

import com.gymrat.dto.ExerciseDto;
import com.gymrat.model.Exercise;
import com.gymrat.repository.ExerciseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;

    public ExerciseController(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    // 🔹 GET ALL EXERCISES - Todos pueden ver
    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll());
    }

    // 🔹 GET EXERCISE BY ID - Todos pueden ver
    @GetMapping("/{id}")
    public ResponseEntity<?> getExerciseById(@PathVariable Long id) {
        return exerciseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 CREATE EXERCISE - Solo ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createExercise(@RequestBody ExerciseDto exerciseDto) {
        try {
            // Validar que no exista un ejercicio con el mismo nombre
            if (exerciseRepository.existsByNameIgnoreCase(exerciseDto.getName())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "message", "Exercise with this name already exists"
                ));
            }

            Exercise exercise = new Exercise();
            exercise.setName(exerciseDto.getName());
            exercise.setDescription(exerciseDto.getDescription());
            exercise.setStrengthImpact(exerciseDto.getStrengthImpact());
            exercise.setEnduranceImpact(exerciseDto.getEnduranceImpact());
            exercise.setFlexibilityImpact(exerciseDto.getFlexibilityImpact());


            Exercise savedExercise = exerciseRepository.save(exercise);
            return ResponseEntity.ok(savedExercise);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error creating exercise: " + e.getMessage()
            ));
        }
    }

    // 🔹 UPDATE EXERCISE - Solo ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody ExerciseDto exerciseDto) {
        try {
            return exerciseRepository.findById(id)
                    .map(exercise -> {
                        exercise.setName(exerciseDto.getName());
                        exercise.setDescription(exerciseDto.getDescription());
                        exercise.setStrengthImpact(exerciseDto.getStrengthImpact());
                        exercise.setEnduranceImpact(exerciseDto.getEnduranceImpact());
                        exercise.setFlexibilityImpact(exerciseDto.getFlexibilityImpact());
                        return ResponseEntity.ok(exerciseRepository.save(exercise));
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error updating exercise: " + e.getMessage()
            ));
        }
    }

    // 🔹 DELETE EXERCISE - Solo ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        try {
            if (!exerciseRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            exerciseRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Exercise deleted successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error deleting exercise: " + e.getMessage()
            ));
        }
    }
}
