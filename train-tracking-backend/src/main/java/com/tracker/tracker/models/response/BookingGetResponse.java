package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class BookingGetResponse {
    private UUID id;
    private List<UUID> reservationsIds;
    private UUID passengerId;
    private String ticketNumber;
    private UUID travelFromID;
    private UUID travelToId;
    private UUID paymentId;
}
