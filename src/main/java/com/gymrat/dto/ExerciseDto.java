package com.gymrat.dto;

import lombok.Data;

@Data
public class ExerciseDto {
    private Long id;
    private String name;
    private String description;
    private Integer strengthImpact;
    private Integer enduranceImpact;
    private Integer flexibilityImpact;
}
