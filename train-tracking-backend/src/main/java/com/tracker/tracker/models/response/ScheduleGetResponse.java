package com.tracker.tracker.models.response;

import java.sql.Time;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class ScheduleGetResponse {
    private UUID id;
    private UUID depStationId;
    private String depName;
    private UUID arrStationId;
    private String arrName;
    private OffsetDateTime departureTime;
    private OffsetDateTime arrivalTime;
    private int delay;
    private UUID locationId;
    private String location;
    private UUID trainId;
    private String trainName;
}
