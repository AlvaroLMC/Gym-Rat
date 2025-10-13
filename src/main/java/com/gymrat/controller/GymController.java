package com.gymrat.controller;

import com.gymrat.dto.*;
import com.gymrat.model.*;
import com.gymrat.service.GymService;
import com.gymrat.util.MapperUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GymController {

    private final GymService gymService;

    public GymController(GymService gymService) {
        this.gymService = gymService;
    }

    // 🔹 USER OPERATIONS
    @PostMapping("/users/{id}/train")
    public ResponseEntity<UserDto> train(@PathVariable Long id, @RequestBody @Valid TrainDto dto) {
        User user = gymService.train(id, dto.getStat(), dto.getAmount());
        return ResponseEntity.ok(MapperUtil.toDto(user));
    }

    @PostMapping("/users/{id}/rest")
    public ResponseEntity<UserDto> rest(@PathVariable Long id, @RequestBody @Valid RestDto dto) {
        User user = gymService.rest(id, dto.getAmount());
        return ResponseEntity.ok(MapperUtil.toDto(user));
    }

    @PostMapping("/users/{id}/purchase")
    public ResponseEntity<AccessoryDto> purchase(@PathVariable Long id, @RequestBody @Valid PurchaseDto dto) {
        Accessory accessory = gymService.purchaseAccessory(id, dto.getAccessoryName());
        return ResponseEntity.ok(MapperUtil.toDto(accessory));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        User user = gymService.getUser(id);
        return ResponseEntity.ok(MapperUtil.toDto(user));
    }

    // 🔹 EXERCISES
    @PostMapping("/exercises")
    public ResponseEntity<ExerciseDto> createExercise(@RequestBody @Valid Exercise e) {
        Exercise exercise = gymService.createExercise(e);
        return ResponseEntity.ok(MapperUtil.toDto(exercise));
    }

    @GetMapping("/exercises")
    public ResponseEntity<List<ExerciseDto>> listExercises() {
        List<ExerciseDto> exercises = gymService.listExercises()
                .stream()
                .map(MapperUtil::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(exercises);
    }

    // 🔹 ROUTINES
    @PostMapping("/routines")
    public ResponseEntity<RoutineDto> createRoutine(@RequestBody @Valid Routine r) {
        Routine routine = gymService.createRoutine(r);
        return ResponseEntity.ok(MapperUtil.toDto(routine));
    }

    @GetMapping("/routines")
    public ResponseEntity<List<RoutineDto>> listRoutines() {
        List<RoutineDto> routines = gymService.listRoutines()
                .stream()
                .map(MapperUtil::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(routines);
    }

    // 🔹 SESSIONS
    @PostMapping("/users/{id}/sessions")
    public ResponseEntity<TrainingSessionDto> addSession(@PathVariable Long id, @RequestBody @Valid SessionDto dto) {
        TrainingSession session = gymService.addSession(id, dto.getDescription());
        return ResponseEntity.ok(MapperUtil.toDto(session));
    }

    @GetMapping("/users/{id}/sessions")
    public ResponseEntity<List<TrainingSessionDto>> sessions(@PathVariable Long id) {
        List<TrainingSessionDto> sessions = gymService.getSessions(id)
                .stream()
                .map(MapperUtil::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sessions);
    }
}
