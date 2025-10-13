package com.gymrat.dto;

import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class RoutineDto {
    private Long id;
    private String name;
    private List<ExerciseDto> exercises;

    // Getters y Setters
    // ...
}
