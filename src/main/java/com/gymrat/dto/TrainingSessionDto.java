package com.gymrat.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class TrainingSessionDto {
    private Long id;
    private String description;
    private LocalDateTime timestamp;

    // Getters y Setters
    // ...
}
