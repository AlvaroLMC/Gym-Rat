package com.gymrat.dto;

import jakarta.validation.constraints.NotBlank;

public class SessionDto {
    @NotBlank
    private String description;

    public SessionDto() {}

    public SessionDto(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}