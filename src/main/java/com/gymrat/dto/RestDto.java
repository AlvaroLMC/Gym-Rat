package com.gymrat.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestDto {
    @Min(value = 1, message = "Amount must be a positive value.")
    private int amount = 5;

}