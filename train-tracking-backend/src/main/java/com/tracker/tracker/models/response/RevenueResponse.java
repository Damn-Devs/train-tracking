package com.tracker.tracker.models.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RevenueResponse {
    private FirstClassRevenueResponse firstClassRevenueResponse;
    private SecondClassRevenueResponse secondClassRevenueResponse;
    private ThirdClassRevenueResponse thirdClassRevenueResponse;
    private double totalRevenue;
}
