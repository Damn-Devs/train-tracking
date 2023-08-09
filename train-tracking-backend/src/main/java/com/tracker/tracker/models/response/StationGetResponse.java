package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.UUID;
@Data
public class StationGetResponse {
    private UUID id;
    private String name;
    private String address;
    private double lat;
    private double lng;
    private String contact;
}
