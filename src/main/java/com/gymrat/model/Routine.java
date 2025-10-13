package com.gymrat.model;

import com.gymrat.exception.ResourceNotFoundException;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Routine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToMany
    private List<Exercise> exercises = new ArrayList<>();

    public Routine() {}
    public Routine(String name) { this.name = name; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Exercise> getExercises() { return exercises; }
    public void setExercises(List<Exercise> exercises) { this.exercises = exercises; }

    public static Routine validateExists(Routine routine, Long id) {
        if (routine == null) throw new ResourceNotFoundException("Routine not found with id " + id);
        return routine;
    }
}
