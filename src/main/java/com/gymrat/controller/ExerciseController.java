package com.gymrat.controller;

import com.gymrat.dto.ExerciseDto;
import com.gymrat.model.Exercise;
import com.gymrat.repository.ExerciseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private static final Logger logger = LoggerFactory.getLogger(ExerciseController.class);

    private final ExerciseRepository exerciseRepository;

    public ExerciseController(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Exercise>> getAllExercises() {
        logger.debug("Attempting to retrieve all exercises.");
        List<Exercise> exercises = exerciseRepository.findAll();
        logger.info("Successfully retrieved {} exercises.", exercises.size());
        return ResponseEntity.ok(exercises);
    }



    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> createExercise(@RequestBody ExerciseDto exerciseDto) {
        logger.info("Attempting to create a new exercise: {}", exerciseDto.getName());
        try {
            if (exerciseRepository.existsByNameIgnoreCase(exerciseDto.getName())) {
                logger.warn("Creation failed: Exercise name already exists: {}", exerciseDto.getName());
                return ResponseEntity.badRequest().body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "message", "Exercise with this name already exists"
                ));
            }

            Exercise exercise = new Exercise();
            exercise.setName(exerciseDto.getName());
            exercise.setDescription(exerciseDto.getDescription());
            exercise.setCategory(exerciseDto.getCategory());
            exercise.setStrengthImpact(exerciseDto.getStrengthImpact());
            exercise.setEnduranceImpact(exerciseDto.getEnduranceImpact());
            exercise.setFlexibilityImpact(exerciseDto.getFlexibilityImpact());


            Exercise savedExercise = exerciseRepository.save(exercise);
            logger.info("Successfully created new exercise with ID: {}", savedExercise.getId());
            return ResponseEntity.ok(savedExercise);

        } catch (Exception e) {
            logger.error("Error occurred while creating exercise: {}", exerciseDto.getName(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error creating exercise: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody ExerciseDto exerciseDto) {
        logger.info("Attempting to update exercise with ID: {}", id);
        try {
            return exerciseRepository.findById(id)
                    .map(exercise -> {
                        logger.debug("Original exercise found. Applying updates: {}", exerciseDto.getName());
                        exercise.setName(exerciseDto.getName());
                        exercise.setDescription(exerciseDto.getDescription());
                        exercise.setCategory(exerciseDto.getCategory());
                        exercise.setStrengthImpact(exerciseDto.getStrengthImpact());
                        exercise.setEnduranceImpact(exerciseDto.getEnduranceImpact());
                        exercise.setFlexibilityImpact(exerciseDto.getFlexibilityImpact());

                        Exercise updatedExercise = exerciseRepository.save(exercise);
                        logger.info("Successfully updated exercise with ID: {}", updatedExercise.getId());
                        return ResponseEntity.ok(updatedExercise);
                    })
                    .orElseGet(() -> {
                        logger.warn("Update failed: Exercise not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });

        } catch (Exception e) {
            logger.error("Error occurred while updating exercise with ID: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error updating exercise: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        logger.info("Attempting to delete exercise with ID: {}", id);
        try {
            if (!exerciseRepository.existsById(id)) {
                logger.warn("Deletion failed: Exercise not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
            exerciseRepository.deleteById(id);
            logger.info("Successfully deleted exercise with ID: {}", id);
            return ResponseEntity.ok(Map.of("message", "Exercise deleted successfully"));

        } catch (Exception e) {
            logger.error("Error occurred while deleting exercise with ID: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "message", "Error deleting exercise: " + e.getMessage()
            ));
        }
    }
}
