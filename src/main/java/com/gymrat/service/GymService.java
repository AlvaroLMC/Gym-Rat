package com.gymrat.service;

import com.gymrat.exception.AccessoryPurchaseException;
import com.gymrat.exception.ResourceNotFoundException;
import com.gymrat.model.*;
import com.gymrat.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class GymService {

    private final UserRepository userRepository;
    private final AccessoryRepository accessoryRepository;
    private final ExerciseRepository exerciseRepository;
    private final RoutineRepository routineRepository;
    private final TrainingSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private static final int MAX_STAT = 100;

    public GymService(UserRepository userRepository,
                      AccessoryRepository accessoryRepository,
                      ExerciseRepository exerciseRepository,
                      RoutineRepository routineRepository,
                      TrainingSessionRepository sessionRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accessoryRepository = accessoryRepository;
        this.exerciseRepository = exerciseRepository;
        this.routineRepository = routineRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String name, String username, String rawPassword) {
        if (userRepository.findByUsernameIgnoreCase(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        User u = new User(name, username, passwordEncoder.encode(rawPassword));
        u.setRole(Role.USER);
        return userRepository.save(u);
    }

    public User createUser(String name) {
        String username = name.toLowerCase();
        if (userRepository.findByUsernameIgnoreCase(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        User u = new User(name, username, passwordEncoder.encode("password"));
        return userRepository.save(u);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    @Transactional
    public User updateStats(Long userId, Map<Stat, Integer> deltas, String actionDescription) {
        User u = getUser(userId);
        deltas.forEach((stat, delta) -> {
            switch (stat) {
                case STRENGTH -> u.setStrength(Math.max(0, Math.min(MAX_STAT, u.getStrength() + delta)));
                case ENDURANCE -> u.setEndurance(Math.max(0, Math.min(MAX_STAT, u.getEndurance() + delta)));
                case FLEXIBILITY -> u.setFlexibility(Math.max(0, Math.min(MAX_STAT, u.getFlexibility() + delta)));
            }
        });
        sessionRepository.save(new TrainingSession(actionDescription, u));
        return userRepository.save(u);
    }

    public User train(Long userId, Stat stat, int amount) {
        return updateStats(userId, Map.of(stat, amount), "Trained " + stat.name() + " by " + amount);
    }

    public User rest(Long userId, int amount) {
        return updateStats(userId, Map.of(
                Stat.STRENGTH, -amount,
                Stat.ENDURANCE, -amount,
                Stat.FLEXIBILITY, -amount
        ), "Rested by " + amount);
    }

    private void updateStat(User u, Stat stat, int delta) {
        switch (stat) {
            case STRENGTH -> u.setStrength(Math.max(0, Math.min(MAX_STAT, u.getStrength() + delta)));
            case ENDURANCE -> u.setEndurance(Math.max(0, Math.min(MAX_STAT, u.getEndurance() + delta)));
            case FLEXIBILITY -> u.setFlexibility(Math.max(0, Math.min(MAX_STAT, u.getFlexibility() + delta)));
        }
    }

    private boolean canPurchaseAccessory(User u) {
        return u.getStrength() == MAX_STAT &&
                u.getEndurance() == MAX_STAT &&
                u.getFlexibility() == MAX_STAT &&
                !u.isAccessoryPurchased();
    }

    @Transactional
    public Accessory purchaseAccessory(Long userId, String accessoryName) {
        User u = getUser(userId);
        if (!canPurchaseAccessory(u)) {
            throw new AccessoryPurchaseException(
                    "User does not meet requirements to purchase accessory or accessory already purchased"
            );
        }
        Accessory a = new Accessory(accessoryName);
        a = accessoryRepository.save(a);
        u.setAccessoryPurchased(true);
        u.setAccessoryName(accessoryName);
        userRepository.save(u);
        return a;
    }

    public Exercise createExercise(Exercise e) {
        if (exerciseRepository.findAll().stream().anyMatch(x -> x.getName().equalsIgnoreCase(e.getName()))) {
            throw new IllegalArgumentException("Exercise name already exists: " + e.getName());
        }
        return exerciseRepository.save(e);
    }

    public Routine createRoutine(Routine r) {
        if (routineRepository.findAll().stream().anyMatch(x -> x.getName().equalsIgnoreCase(r.getName()))) {
            throw new IllegalArgumentException("Routine name already exists: " + r.getName());
        }
        return routineRepository.save(r);
    }

    public List<Exercise> listExercises() {
        return exerciseRepository.findAll();
    }

    public List<Routine> listRoutines() {
        return routineRepository.findAll();
    }

    public TrainingSession addSession(Long userId, String desc) {
        User u = getUser(userId);
        TrainingSession s = new TrainingSession(desc, u);
        return sessionRepository.save(s);
    }

    public List<TrainingSession> getSessions(Long userId) {
        getUser(userId);
        return sessionRepository.findByUserId(userId);
    }
}
