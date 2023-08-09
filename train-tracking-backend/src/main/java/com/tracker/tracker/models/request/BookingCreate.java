package com.tracker.tracker.models.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class BookingCreate {
    private UUID id;
    private String method;
    private double total;
    private UUID scheduleId;
    private ReservationRequest reservation;
    private UUID passengerId;
    private String ticketNumber;
    private UUID travelFromID;
    private UUID travelToId;
}
