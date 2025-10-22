package com.gymrat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String category;

    @Column(nullable = false)
    private Integer strengthImpact = 0;

    @Column(nullable = false)
    private Integer enduranceImpact = 0;

    @Column(nullable = false)
    private Integer flexibilityImpact = 0;

}
