package com.tracker.tracker.models.request;

import lombok.Data;

import java.util.UUID;

@Data
public class ReservationRequest {
    private UUID id;
    private String trainClass;
    private int seatNumber;
}
