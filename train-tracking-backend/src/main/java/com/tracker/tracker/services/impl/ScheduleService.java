package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Booking;
import com.tracker.tracker.models.entities.Schedule;
import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.entities.TrainStation;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.request.CreateSchedule;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.FindTrainRequest;
import com.tracker.tracker.models.response.ScheduleGetResponse;
import com.tracker.tracker.models.response.ScheduleResponse;
import com.tracker.tracker.models.response.StationGetResponse;
import com.tracker.tracker.repositories.*;
import com.tracker.tracker.repositories.ScheduleRepository;
import com.tracker.tracker.services.IScheduleService;

import java.awt.print.Book;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ScheduleService implements IScheduleService {
    private final UserRepository usersRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserDetailServiceImpl userDetailsService;
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final PassengerRepository passengerRepository;
    private final BookingRepository bookingRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public ScheduleResponse createSchedule(CreateSchedule createSchedule, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();

        Schedule newSchedule =new Schedule();
        Station depSt = stationRepository.getById(createSchedule.getDepStationId());
        newSchedule.setDepartureStation(depSt);
        Station arvSt = stationRepository.getById(createSchedule.getArrStationId());
        newSchedule.setArrivalStation(arvSt);
        newSchedule.setDepartureTime(createSchedule.getDepartureTime());
        newSchedule.setArrivalTime(createSchedule.getArrivalTime());
        Train train = trainRepository.getById(createSchedule.getTrainId());
        newSchedule.setTrain(train);
        newSchedule.setFirstClassAvailable(train.getFirstClassCount());
        newSchedule.setSecondClassAvailable(train.getSecondClassCount());
        newSchedule.setThirdClassAvailable(train.getThirdClassCount());
        newSchedule.setLocation(depSt);
        newSchedule.setCreatedBy(user);
        newSchedule.setCreatedTime(OffsetDateTime.now());
        newSchedule.setModifiedTime(OffsetDateTime.now());
        Schedule schedule = scheduleRepository.save(newSchedule);
        simpMessagingTemplate.convertAndSend("/dashboard/schedule/change", "");
        return ScheduleResponseConvertor(schedule);
    }

    @Override
    public ScheduleResponse updateSchedule(UUID id, CreateSchedule createSchedule, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Schedule updateSchedule = scheduleRepository.findById(id).get();
        Station depSt = stationRepository.getById(createSchedule.getDepStationId());
        updateSchedule.setDepartureStation(depSt);
        Station arvSt = stationRepository.getById(createSchedule.getDepStationId());
        updateSchedule.setArrivalStation(arvSt);
        updateSchedule.setDepartureTime(createSchedule.getDepartureTime());
        updateSchedule.setLocation(depSt);
        updateSchedule.setArrivalTime(createSchedule.getArrivalTime());
        Train train = trainRepository.getById(createSchedule.getTrainId());
        updateSchedule.setTrain(train);
        updateSchedule.setModifiedBy(user);
        updateSchedule.setModifiedTime(OffsetDateTime.now());
        simpMessagingTemplate.convertAndSend("/dashboard/schedule/change", "");
        return ScheduleResponseConvertor(scheduleRepository.save(updateSchedule));
    }

    @Override
    public List<ScheduleGetResponse> getSchedule(UUID trainId) {
        List<ScheduleGetResponse> stationGetResponses = new ArrayList<>();
        {
            if (scheduleRepository.findAll().size()>0) {
                stationGetResponses.add(stationGetResponsesConverter(scheduleRepository.findById(trainId).get()));
            }
        }
        return stationGetResponses;
    }

    @Override
    public List<ScheduleGetResponse> getAllSchedule() {
        List<ScheduleGetResponse> stationGetResponses = new ArrayList<>();

        for (Schedule train :
                scheduleRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
            stationGetResponses.add(stationGetResponsesConverter(train));
        }
        return stationGetResponses;
    }

    @Override
    public ScheduleResponse deleteSchedule(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Schedule DeleSchedule =
                scheduleRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DeleSchedule .setDeleted(deleteRequest.getDelete());
        DeleSchedule .setModifiedBy(user);
        DeleSchedule .setModifiedTime(OffsetDateTime.now());
        simpMessagingTemplate.convertAndSend("/dashboard/schedule/change", "");
        return ScheduleResponseConvertor(scheduleRepository.save(DeleSchedule));
    }

    @Override
    public List<Schedule> findTrain(FindTrainRequest findTrainRequest,
        Principal principal) {
        List<UUID> stations = new ArrayList<>();
        stations.add(findTrainRequest.getFromStation());
        stations.add(findTrainRequest.getToStation());

        List<Schedule> schedules = scheduleRepository
            .findDistinctByTrain_TrainStations_Station_IdInAndArrivalTimeBetween(
                stations, findTrainRequest.getFromDate(), findTrainRequest.getToDate());


        List<Schedule> validSchedules = new ArrayList<>();

        for (Schedule schedule: schedules) {
           List<TrainStation> fromTrainStation =
               schedule.getTrain()
                   .getTrainStations()
                   .stream()
                   .filter(ts -> ts.getStation().getId().equals(findTrainRequest.getFromStation()))
                   .collect(Collectors.toList());

            List<TrainStation> toTrainStation =
                schedule.getTrain()
                    .getTrainStations()
                    .stream()
                    .filter(ts -> ts.getStation().getId().equals(findTrainRequest.getToStation()))
                    .collect(Collectors.toList());


            if(fromTrainStation.size() > 0 && toTrainStation.size() > 0){
                if(toTrainStation.get(0).getStationOrder() > fromTrainStation.get(0).getStationOrder()){
                    switch (findTrainRequest.getTrain_class()) {
                        case "First":
                            if (schedule.getFirstClassAvailable()
                                >= findTrainRequest.getPassengerCount()) {
                                validSchedules.add(schedule);
                            }
                            break;
                        case "Second":
                            if (schedule.getSecondClassAvailable()
                                >= findTrainRequest.getPassengerCount()) {
                                validSchedules.add(schedule);
                            }
                            break;
                        case "Third":
                            if (schedule.getThirdClassAvailable()
                                >= findTrainRequest.getPassengerCount()) {
                                validSchedules.add(schedule);
                            }
                            break;
                    }
                }
            }
        }

        return validSchedules;
    }

    @Override
    public List<String> getScheduleStations(UUID id, Principal principal) {
        Schedule schedule = scheduleRepository.getById(id);
        List<String> stations = new ArrayList<>();

        for (TrainStation trainStation: schedule.getTrain().getTrainStations()) {
            stations.add(trainStation.getStation().getName());
        }
        return stations;
    }

    @Override
    public List<ScheduleGetResponse> getScheduleByTrain(UUID id) {
        List<ScheduleGetResponse> stationGetResponses = new ArrayList<>();

        for (Schedule train :
                scheduleRepository.findByTrain_IdAndDeletedOrderByDepartureStation_CreatedTimeDesc(id,false)) {
            stationGetResponses.add(stationGetResponsesConverter(train));
        }
        return stationGetResponses;
    }

    @Override
    public ScheduleResponse updateDelay(UUID id, int time, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Schedule schedule = scheduleRepository.getById(id);
        schedule.setDelay(time);
        schedule.setModifiedTime(OffsetDateTime.now());
        schedule.setModifiedBy(user);

        List<Booking> bookings =
            bookingRepository.findBySchedule_IdAndSchedule_ArrivalTimeGreaterThan(schedule.getId(), OffsetDateTime.now());

        for (Booking booking: bookings) {
            simpMessagingTemplate.convertAndSend("/specific/" + booking.getPassenger().getUser().getUsername() + "/notify", booking.getSchedule().getTrain().getName() + " train delay with " + booking.getSchedule().getDelay() + " mins");
        }
        return ScheduleResponseConvertor(scheduleRepository.save(schedule));
    }

    @Override
    public List<StationGetResponse> getStationByTrain(UUID id) {
        List<StationGetResponse> stationGetResponses = new ArrayList<>();
        Train trains = trainRepository.getById(id);
        Set<TrainStation> stationList = trains.getTrainStations();
        for (TrainStation train :
                stationList) {
            stationGetResponses.add(stationGetResponsesConverterByTrain(train));
        }
        return stationGetResponses;
    }

    @Override
    public ScheduleResponse updatelocations(UUID id, UUID loc, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Schedule schedule = scheduleRepository.getById(id);
        Station station = stationRepository.getById(loc);
        schedule.setLocation(station);
        schedule.setModifiedTime(OffsetDateTime.now());
        schedule.setModifiedBy(user);
        simpMessagingTemplate.convertAndSend("/dashboard/schedule/change", "");
        return ScheduleResponseConvertor(scheduleRepository.save(schedule));
    }

    @Override
    public List<LiveRes> getAllScheduleLiveLocations(OffsetDateTime from, OffsetDateTime to, Principal principal) {
        List<LiveRes> listRes = new ArrayList<>();

        for (Schedule schedule :
                scheduleRepository.findByDeletedAndDepartureTimeBetween( false,from,to)) {
            listRes.add(scheduleLocationConverter(schedule));
        }
        return listRes;
    }

    private LiveRes scheduleLocationConverter(Schedule schedule) {
        LiveRes liveRes = new LiveRes();
        liveRes.setId(schedule.getId());
        liveRes.setName(schedule.getTrain().getName());
        liveRes.setLatitude(schedule.getLocation().getLat());
        liveRes.setLongitude(schedule.getLocation().getLng());
        return liveRes;
    }

    private StationGetResponse stationGetResponsesConverterByTrain(TrainStation train) {
        StationGetResponse stationGetResponse = new StationGetResponse();
        stationGetResponse.setId(train.getStation().getId());
        stationGetResponse.setName(train.getStation().getName());
        return (stationGetResponse);
    }

    private ScheduleGetResponse stationGetResponsesConverter(Schedule schedule) {
        ScheduleGetResponse stationGetResponse = new ScheduleGetResponse();
        stationGetResponse.setId(schedule.getId());
        stationGetResponse.setDepStationId(schedule.getDepartureStation().getId());
        stationGetResponse.setArrStationId(schedule.getArrivalStation().getId());
        stationGetResponse.setDepartureTime(schedule.getDepartureTime());
        stationGetResponse.setArrivalTime(schedule.getArrivalTime());
        stationGetResponse.setDelay(schedule.getDelay());
        stationGetResponse.setTrainId(schedule.getTrain().getId());
        stationGetResponse.setArrName(schedule.getArrivalStation().getName());
        stationGetResponse.setDepName(schedule.getDepartureStation().getName());
        stationGetResponse.setTrainName(schedule.getTrain().getName());
        if(schedule.getLocation() != null){
            stationGetResponse.setLocationId(schedule.getLocation().getId());
            stationGetResponse.setLocation(schedule.getLocation().getName());
        } else {
            stationGetResponse.setLocationId(null);
            stationGetResponse.setLocation("N/A");
        }

        return stationGetResponse;
    }

    private ScheduleResponse ScheduleResponseConvertor(Schedule train) {
        ScheduleResponse stationGetResponse = new ScheduleResponse();
        stationGetResponse.setId(train.getId());
        return stationGetResponse;
    }
}
