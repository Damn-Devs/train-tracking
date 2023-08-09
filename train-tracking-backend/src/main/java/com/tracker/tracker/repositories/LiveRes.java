package com.tracker.tracker.repositories;

import lombok.Data;

import java.util.UUID;

@Data
public class LiveRes {
    private UUID id;
    private String name;
    private double latitude;
    private double longitude;
}
