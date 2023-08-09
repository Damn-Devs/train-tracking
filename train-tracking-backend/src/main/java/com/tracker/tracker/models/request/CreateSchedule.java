package com.tracker.tracker.models.request;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class CreateSchedule {
    private UUID id;
    private UUID depStationId;
    private UUID arrStationId;
    private OffsetDateTime departureTime;
    private OffsetDateTime arrivalTime;
    private UUID trainId;
}
