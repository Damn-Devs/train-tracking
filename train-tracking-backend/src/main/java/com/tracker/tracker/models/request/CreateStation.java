package com.tracker.tracker.models.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class CreateStation {
    private UUID id;
    @NotBlank
    @NotNull
    @NotEmpty
    private String name;
    private String address;
    @NotNull
    private double lat;
    @NotNull
    private double lng;
    @NotBlank @NotNull @NotEmpty
    private String contact;
}
