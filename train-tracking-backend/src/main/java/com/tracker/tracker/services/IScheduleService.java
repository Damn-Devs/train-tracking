package com.tracker.tracker.services;

import com.tracker.tracker.models.entities.Schedule;
import com.tracker.tracker.models.request.CreateSchedule;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.FindTrainRequest;
import com.tracker.tracker.models.response.ScheduleGetResponse;
import com.tracker.tracker.models.response.ScheduleResponse;
import com.tracker.tracker.models.response.StationGetResponse;
import com.tracker.tracker.repositories.LiveRes;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface IScheduleService {
    ScheduleResponse createSchedule(CreateSchedule createSchedule, Principal principal);

    ScheduleResponse updateSchedule(UUID id, CreateSchedule createSchedule, Principal principal);

    List<ScheduleGetResponse> getSchedule(UUID scheduleId);

    List<ScheduleGetResponse> getAllSchedule();

    ScheduleResponse deleteSchedule(DeleteRequest deleteRequest, Principal principal);

  List<Schedule> findTrain(FindTrainRequest findTrainRequest, Principal principal);

    List<String> getScheduleStations(UUID id, Principal principal);

    List<ScheduleGetResponse> getScheduleByTrain(UUID id);

    ScheduleResponse updateDelay(UUID id, int time, Principal principal);

    List<StationGetResponse> getStationByTrain(UUID id);

    ScheduleResponse updatelocations(UUID id, UUID loc, Principal principal);

    List<LiveRes> getAllScheduleLiveLocations(OffsetDateTime from,OffsetDateTime to, Principal principal);
}
