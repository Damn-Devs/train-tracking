package com.tracker.tracker.models.request;

import com.tracker.tracker.models.json.UuidWithOrder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

@Data
public class CreateTrain {
    private UUID id;
    @NotBlank
    @NotNull
    @NotEmpty
    private String name;
    @NotNull
    private int firstClassCount;
    @NotNull
    private int secondClassCount;
    @NotNull
    private int thirdClassCount;
    @NotNull
    private Set<UuidWithOrder> station;

}
