package com.gymrat.dto;

import com.gymrat.model.Role;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data

public class UserDto {
    private Long id;
    private String name;
    private String username;
    private Role role;
    private int strength;
    private int endurance;
    private int flexibility;
    private boolean accessoryPurchased;
    private List<TrainingSessionDto> sessions;

    // Getters y Setters
    // ...
}
