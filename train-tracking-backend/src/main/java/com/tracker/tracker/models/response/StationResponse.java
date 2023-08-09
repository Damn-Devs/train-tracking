package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class StationResponse {
    private UUID id;
    private String name;
}
