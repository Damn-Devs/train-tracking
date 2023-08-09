package com.tracker.tracker.services;

import com.tracker.tracker.models.request.FindRevenue;
import com.tracker.tracker.models.response.RevenueResponse;

public interface IRevenueService {

    RevenueResponse getRevenueOverview(String trainName);

}
