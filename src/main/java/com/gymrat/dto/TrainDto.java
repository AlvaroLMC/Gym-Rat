package com.gymrat.dto;

import com.gymrat.model.Stat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainDto {
    @NotNull
    private Stat stat;
    @Min(value = 1, message = "Amount must be a positive value.")
    private int amount = 10;
}