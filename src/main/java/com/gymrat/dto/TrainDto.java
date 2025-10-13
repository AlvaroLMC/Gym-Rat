package com.gymrat.dto;

import com.gymrat.model.Stat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class TrainDto {
    @NotNull
    private Stat stat;
    @Min(value = 1, message = "Amount must be a positive value.")
    private int amount = 10;

    public TrainDto() {}

    public TrainDto(Stat stat, int amount) {
        this.stat = stat;
        this.amount = amount;
    }

    public Stat getStat() {
        return stat;
    }

    public void setStat(Stat stat) {
        this.stat = stat;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}