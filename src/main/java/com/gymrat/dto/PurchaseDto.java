package com.gymrat.dto;

public class PurchaseDto {
    private String accessoryName;

    public PurchaseDto() {}

    public PurchaseDto(String accessoryName) {
        this.accessoryName = accessoryName;
    }

    public String getAccessoryName() {
        return accessoryName;
    }

    public void setAccessoryName(String accessoryName) {
        this.accessoryName = accessoryName;
    }
}
