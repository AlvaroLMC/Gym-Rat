package com.gymrat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor

public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String role;
    private int strength;
    private int endurance;
    private int flexibility;

    private boolean accessoryPurchased;
    private String accessoryName;
    private List<TrainingSessionDto> sessions;


}