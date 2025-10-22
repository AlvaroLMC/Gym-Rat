package com.gymrat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor

public class RegisterDto {
    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank
    @Size(min = 4, max = 20)
    private String username;

    @NotBlank
    @Size(min = 8)
    private String password;


}