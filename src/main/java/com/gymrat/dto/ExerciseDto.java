package com.gymrat.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class ExerciseDto {
    private Long id;
    private String name;
    private String description;
    private int strengthImpact;
    private int enduranceImpact;
    private int flexibilityImpact;

    // Getters y Setters
    // ...
}
