package com.gymrat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TrainingSessionDto {
    private Long id;
    private String description;
    private LocalDateTime timestamp;
}
