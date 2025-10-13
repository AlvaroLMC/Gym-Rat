package com.gymrat.model;

import com.gymrat.exception.ResourceNotFoundException;
import jakarta.persistence.*;

@Entity
public class Accessory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public Accessory() {}
    public Accessory(String name) { this.name = name; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // Método auxiliar para validar existencia
    public static Accessory validateExists(Accessory accessory, Long id) {
        if (accessory == null) throw new ResourceNotFoundException("Accessory not found with id " + id);
        return accessory;
    }
}
