package com.gymrat.util;

import com.gymrat.dto.*;
import com.gymrat.model.*;
import java.util.stream.Collectors;

public class MapperUtil {

    public static UserDto toDto(User user) {
        if(user == null) return null;
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
        dto.setSessions(user.getSessions().stream()
                .map(MapperUtil::toDto)
                .collect(Collectors.toList()));
        return dto;
    }

    public static AccessoryDto toDto(Accessory a) {
        if(a == null) return null;
        AccessoryDto dto = new AccessoryDto();
        dto.setId(a.getId());
        dto.setName(a.getName());
        return dto;
    }

    public static ExerciseDto toDto(Exercise e) {
        if(e == null) return null;
        ExerciseDto dto = new ExerciseDto();
        dto.setName(e.getName());
        dto.setDescription(e.getDescription());
        dto.setCategory(e.getCategory());
        dto.setStrengthImpact(e.getStrengthImpact());
        dto.setEnduranceImpact(e.getEnduranceImpact());
        dto.setFlexibilityImpact(e.getFlexibilityImpact());
        return dto;
    }

    public static RoutineDto toDto(Routine r) {
        if(r == null) return null;
        RoutineDto dto = new RoutineDto();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setExercises(r.getExercises().stream()
                .map(MapperUtil::toDto)
                .collect(Collectors.toList()));
        return dto;
    }

    public static TrainingSessionDto toDto(TrainingSession s) {
        if(s == null) return null;
        TrainingSessionDto dto = new TrainingSessionDto();
        dto.setId(s.getId());
        dto.setDescription(s.getDescription());
        dto.setTimestamp(s.getTimestamp());
        return dto;
    }
}
