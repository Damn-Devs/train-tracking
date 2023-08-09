package com.tracker.tracker.models.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

@Data
public class DeleteRequest {
    String id;
    @NotNull
    Boolean delete;
    OffsetDateTime deleteDate;
}