package com.gymrat.dto;

import jakarta.validation.constraints.Min;

public class RestDto {
    @Min(value = 1, message = "Amount must be a positive value.")
    private int amount = 5;

    public RestDto() {}

    public RestDto(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}