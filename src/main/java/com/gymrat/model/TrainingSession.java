package com.gymrat.model;

import com.gymrat.exception.ResourceNotFoundException;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class TrainingSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private LocalDateTime timestamp = LocalDateTime.now();

    @ManyToOne
    private User user;

    public TrainingSession() {}
    public TrainingSession(String description, User user) {
        this.description = description;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static TrainingSession validateExists(TrainingSession session, Long id) {
        if (session == null) throw new ResourceNotFoundException("TrainingSession not found with id " + id);
        return session;
    }
}
