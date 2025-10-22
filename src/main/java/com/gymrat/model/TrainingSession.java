package com.gymrat.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "training_sessions")
@Data
public class TrainingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime timestamp;


    public TrainingSession() {
        this.timestamp = LocalDateTime.now();
    }

    //unificar los dos constructores (hacen lo mismo pero afecta el orden)

    public TrainingSession(User user, String description) {
        this.user = user;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    public TrainingSession(String description, User user) {
        this.description = description;
        this.user = user;
        this.timestamp = LocalDateTime.now();
    }
}
