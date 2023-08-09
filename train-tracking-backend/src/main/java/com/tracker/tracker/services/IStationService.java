package com.tracker.tracker.services;

import com.tracker.tracker.models.request.CreateStation;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.StationGetResponse;
import com.tracker.tracker.models.response.StationResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IStationService {
    StationResponse createStation(CreateStation createStation, Principal principal);

    StationResponse updateStation(UUID id, CreateStation createStation, Principal principal);

    List<StationGetResponse> getStation(UUID stationId);

    List<StationGetResponse> getAllStation();

    StationResponse deleteStation(DeleteRequest deleteRequest, Principal principal);
}
