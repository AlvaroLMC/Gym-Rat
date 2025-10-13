package com.gymrat.model;

import com.gymrat.exception.ResourceNotFoundException;
import jakarta.persistence.*;

@Entity
public class Exercise {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private int strengthImpact;
    private int enduranceImpact;
    private int flexibilityImpact;

    public Exercise() {}
    public Exercise(String name, String description, int s, int e, int f) {
        this.name = name; this.description = description;
        this.strengthImpact = s; this.enduranceImpact = e; this.flexibilityImpact = f;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getStrengthImpact() { return strengthImpact; }
    public void setStrengthImpact(int strengthImpact) { this.strengthImpact = strengthImpact; }
    public int getEnduranceImpact() { return enduranceImpact; }
    public void setEnduranceImpact(int enduranceImpact) { this.enduranceImpact = enduranceImpact; }
    public int getFlexibilityImpact() { return flexibilityImpact; }
    public void setFlexibilityImpact(int flexibilityImpact) { this.flexibilityImpact = flexibilityImpact; }

    public static Exercise validateExists(Exercise exercise, Long id) {
        if (exercise == null) throw new ResourceNotFoundException("Exercise not found with id " + id);
        return exercise;
    }
}
