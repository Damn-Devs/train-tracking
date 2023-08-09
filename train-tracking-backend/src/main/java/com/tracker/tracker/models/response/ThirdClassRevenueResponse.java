package com.tracker.tracker.models.response;

import lombok.Builder;
import lombok.Data;

/**
 * Use this class to represent the first class revenue data...
 * */

@Data
@Builder
public class ThirdClassRevenueResponse {
    private int ticketsSold;
    private int ticketsBooked;
    private double averageSellingRate;
    private float revenueProportion;
    private double total;
}
