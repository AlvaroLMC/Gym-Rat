package com.gymrat.dto;

import java.util.List;

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

    // Constructors
    public UserDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getStrength() {
        return strength;
    }

    public void setStrength(int strength) {
        this.strength = strength;
    }

    public int getEndurance() {
        return endurance;
    }

    public void setEndurance(int endurance) {
        this.endurance = endurance;
    }

    public int getFlexibility() {
        return flexibility;
    }

    public void setFlexibility(int flexibility) {
        this.flexibility = flexibility;
    }

    public boolean isAccessoryPurchased() {
        return accessoryPurchased;
    }

    public void setAccessoryPurchased(boolean accessoryPurchased) {
        this.accessoryPurchased = accessoryPurchased;
    }

    public String getAccessoryName() {
        return accessoryName;
    }

    public void setAccessoryName(String accessoryName) {
        this.accessoryName = accessoryName;
    }

    public List<TrainingSessionDto> getSessions() {
        return sessions;
    }

    public void setSessions(List<TrainingSessionDto> sessions) {
        this.sessions = sessions;
    }
}
