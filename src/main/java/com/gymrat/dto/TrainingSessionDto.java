package com.gymrat.dto;

import java.time.LocalDateTime;

public class TrainingSessionDto {
    private Long id;
    private String description;
    private LocalDateTime timestamp;

    // Constructors
    public TrainingSessionDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
