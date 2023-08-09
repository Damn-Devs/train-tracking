package com.tracker.tracker.services;

import com.tracker.tracker.models.json.TrainChartStatistic;
import com.tracker.tracker.models.json.TrainNameRevenue;
import com.tracker.tracker.models.request.CreateTrain;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.TrainGetResponse;
import com.tracker.tracker.models.response.TrainResponse;
import com.tracker.tracker.models.response.UserResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface ITrainService {
    TrainResponse createTrain(CreateTrain createTrain, Principal principal);

    TrainResponse updateTrain(UUID id, CreateTrain createTrain, Principal principal);

    List<TrainGetResponse> getTrain(UUID trainId);

    List<TrainGetResponse> getAllTrain();

    TrainResponse deleteTrain(DeleteRequest deleteRequest, Principal principal);

    long getCount();

    List<TrainChartStatistic> getTrainStatisticsChart(String trainName);

    List<TrainNameRevenue> getTrainAndRevenue();
}
