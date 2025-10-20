package com.gymrat.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateRoutineDto {
    private String name;
    private List<Long> exercises; // Lista de IDs de ejercicios
}
