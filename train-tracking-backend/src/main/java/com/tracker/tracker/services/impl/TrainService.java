package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Booking;
import com.tracker.tracker.models.entities.Payment;
import com.tracker.tracker.models.entities.Role;
import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.entities.TrainStation;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.json.*;
import com.tracker.tracker.models.request.CreateTrain;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.UserCreateRequest;
import com.tracker.tracker.models.response.TrainGetResponse;
import com.tracker.tracker.models.response.TrainResponse;
import com.tracker.tracker.models.response.UserGetResponse;
import com.tracker.tracker.models.response.UserResponse;
import com.tracker.tracker.repositories.BookingRepository;
import com.tracker.tracker.repositories.StationRepository;
import com.tracker.tracker.repositories.TrainRepository;
import com.tracker.tracker.repositories.TranStationRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.ITrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TrainService implements ITrainService {
    private final TrainRepository trainRepository;
    private final UserRepository usersRepository;
    private final StationRepository stationRepository;
    private final UserDetailServiceImpl userDetailsService;
    private final TranStationRepository trainStationRepository;
    private final BookingRepository bookingRepository;
    @Override
    public TrainResponse createTrain(CreateTrain createTrain, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();

        Train newTrain =new Train();
        newTrain.setName(createTrain.getName());
        newTrain.setFirstClassCount(createTrain.getFirstClassCount());
        newTrain.setSecondClassCount(createTrain.getSecondClassCount());
        newTrain.setThirdClassCount(createTrain.getThirdClassCount());

        Set<TrainStation> trainStations = new HashSet<>();
        if (createTrain.getStation().size() > 0) {
            for (UuidWithOrder uuidWithOrder: createTrain.getStation()) {
                TrainStation trainStation = new TrainStation();
                Station station = stationRepository.findById(uuidWithOrder.getId()).get();
                trainStation.setStation(station);
                trainStation.setStationOrder(uuidWithOrder.getOrder());
                trainStations.add(trainStationRepository.save(trainStation));
            }
        }
        newTrain.setTrainStations(trainStations);
        newTrain.setCreatedBy(user);
        newTrain.setCreatedTime(OffsetDateTime.now());
        newTrain.setModifiedTime(OffsetDateTime.now());
        return TrainResponseConvertor(trainRepository.save(newTrain));
    }

    @Override
    public TrainResponse updateTrain(UUID id, CreateTrain createTrain, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Train updateTrain = trainRepository.findById(id).get();
        updateTrain.setName(createTrain.getName());
        updateTrain.setFirstClassCount(createTrain.getFirstClassCount());
        updateTrain.setSecondClassCount(createTrain.getSecondClassCount());
        updateTrain.setThirdClassCount(createTrain.getThirdClassCount());

        for(TrainStation trainStation  : updateTrain.getTrainStations()){
            trainStationRepository.deleteById(trainStation.getId());
        }

        Set<TrainStation> trainStations = new HashSet<>();
        if (createTrain.getStation().size() > 0) {
            for (UuidWithOrder uuidWithOrder: createTrain.getStation()) {
                TrainStation trainStation = new TrainStation();
                Station station = stationRepository.findById(uuidWithOrder.getId()).get();
                trainStation.setStation(station);
                trainStation.setStationOrder(uuidWithOrder.getOrder());
                trainStations.add(trainStationRepository.save(trainStation));
            }
        }

        updateTrain.setTrainStations(trainStations);
        updateTrain.setModifiedBy(user);
        updateTrain.setModifiedTime(OffsetDateTime.now());
        return TrainResponseConvertor(trainRepository.save(updateTrain));
    }

    @Override
    public List<TrainGetResponse> getTrain(UUID trainId) {
        List<TrainGetResponse> trainGetResponses = new ArrayList<>();
        {
            if (trainRepository.findAll().size()>0) {
                trainGetResponses.add(trainGetResponsesConverter(trainRepository.findById(trainId).get()));
            }
        }
        return trainGetResponses;
    }

    @Override
    public List<TrainGetResponse> getAllTrain() {
        List<TrainGetResponse> trainGetResponses = new ArrayList<>();

        for (Train train :
                trainRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
            trainGetResponses.add(trainGetResponsesConverter(train));
        }
        return trainGetResponses;
    }

    @Override
    public TrainResponse deleteTrain(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Train DeleTrain =
                trainRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DeleTrain .setDeleted(deleteRequest.getDelete());
        DeleTrain .setModifiedBy(user);
        DeleTrain .setModifiedTime(OffsetDateTime.now());

        return TrainResponseConvertor(trainRepository.save(DeleTrain));
    }

    @Override
    public long getCount() {
        return trainRepository.count();
    }

    private TrainGetResponse trainGetResponsesConverter(Train train) {
        TrainGetResponse trainGetResponse = new TrainGetResponse();
        trainGetResponse.setId(train.getId());
        trainGetResponse.setFirstClassCount(train.getFirstClassCount());
        trainGetResponse.setSecondClassCount(train.getSecondClassCount());
        trainGetResponse.setThirdClassCount(train.getThirdClassCount());
        trainGetResponse.setName(train.getName());
        trainGetResponse.setStations(train.getTrainStations());
        return trainGetResponse;
    }

    private TrainResponse TrainResponseConvertor(Train train) {
        TrainResponse trainResponse = new TrainResponse();
        trainResponse.setId(train.getId());
        trainResponse.setName(train.getName());
        return trainResponse;
    }

    public List<TrainChartStatistic> getTrainStatisticsChart(String trainName) {
        int year = OffsetDateTime.now().getYear();
        OffsetDateTime firstDate = OffsetDateTime.of(year, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime lastDate = OffsetDateTime.of(year, 12, 31, 23, 59, 59, 999_999_999, ZoneOffset.UTC);

        List<Booking> bookings =
            bookingRepository.findBySchedule_Train_NameAndCreatedTimeBetween(trainName, firstDate
                , lastDate);

        List<TrainChartStatistic> chartStatics = new ArrayList<>();
        chartStatics.add(new TrainChartStatistic("Jan", 0, 0));
        chartStatics.add(new TrainChartStatistic("Feb", 0, 0));
        chartStatics.add(new TrainChartStatistic("Mar", 0, 0));
        chartStatics.add(new TrainChartStatistic("Apr", 0, 0));
        chartStatics.add(new TrainChartStatistic("May", 0, 0));
        chartStatics.add(new TrainChartStatistic("Jun", 0, 0));
        chartStatics.add(new TrainChartStatistic("Jul", 0, 0));
        chartStatics.add(new TrainChartStatistic("Aug", 0, 0));
        chartStatics.add(new TrainChartStatistic("Sep", 0, 0));
        chartStatics.add(new TrainChartStatistic("Oct", 0, 0));
        chartStatics.add(new TrainChartStatistic("Nov", 0, 0));
        chartStatics.add(new TrainChartStatistic("Dec", 0, 0));

        for (Booking booking:bookings) {
                switch (booking.getPayment().getCreatedTime().getMonth()){
                    case JANUARY:
                        chartStatics.get(0).setRevenue(chartStatics.get(0).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case FEBRUARY:
                        chartStatics.get(1).setRevenue(chartStatics.get(1).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case MARCH:
                        chartStatics.get(2).setRevenue(chartStatics.get(2).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case APRIL:
                        chartStatics.get(3).setRevenue(chartStatics.get(3).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case MAY:
                        chartStatics.get(4).setRevenue(chartStatics.get(4).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case JUNE:
                        chartStatics.get(5).setRevenue(chartStatics.get(5).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case JULY:
                        chartStatics.get(6).setRevenue(chartStatics.get(6).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case AUGUST:
                        chartStatics.get(7).setRevenue(chartStatics.get(7).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case SEPTEMBER:
                        chartStatics.get(8).setRevenue(chartStatics.get(8).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case OCTOBER:
                        chartStatics.get(9).setRevenue(chartStatics.get(9).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case NOVEMBER:
                        chartStatics.get(10).setRevenue(chartStatics.get(10).getRevenue() + booking.getPayment().getTotal());
                        break;
                    case DECEMBER:
                        chartStatics.get(11).setRevenue(chartStatics.get(11).getRevenue() + booking.getPayment().getTotal());
                        break;
                }
        }

        return chartStatics;
    }

    @Override
    public List<TrainNameRevenue> getTrainAndRevenue() {
        int year = OffsetDateTime.now().getYear();
        OffsetDateTime firstDate = OffsetDateTime.of(year, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime lastDate = OffsetDateTime.of(year, 12, 31, 23, 59, 59, 999_999_999, ZoneOffset.UTC);

        List <Train> trains = trainRepository.findAll();
        List<TrainNameRevenue> trainNameRevenues = new ArrayList<>();
        int id = 0;
        for (Train train :trains) {
           List<Booking> bookings =
               bookingRepository.findBySchedule_Train_IdAndCreatedTimeBetween(train.getId(),
                firstDate, lastDate);

           TrainNameRevenue trainNameRevenue = new TrainNameRevenue();
           trainNameRevenue.setId(String.valueOf(id));
           trainNameRevenue.setTrainName(train.getName());
           double revenue = 0;

            for (Booking booking: bookings) {
                revenue += booking.getPayment().getTotal();
            }

            trainNameRevenue.setTicketPrice(revenue);
            trainNameRevenues.add(trainNameRevenue);
        }



        return trainNameRevenues;
    }
}
