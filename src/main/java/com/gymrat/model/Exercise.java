package com.gymrat.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exercises")
@Data
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer strengthImpact = 0; // Impacto en fuerza (0-10)

    @Column(nullable = false)
    private Integer enduranceImpact = 0; // Impacto en resistencia (0-10)

    @Column(nullable = false)
    private Integer flexibilityImpact = 0; // Impacto en flexibilidad (0-10)
}
