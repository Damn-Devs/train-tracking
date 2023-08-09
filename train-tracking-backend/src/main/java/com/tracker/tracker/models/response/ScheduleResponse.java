package com.tracker.tracker.models.response;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class ScheduleResponse {
    private UUID id;
    private String trainId;
}
