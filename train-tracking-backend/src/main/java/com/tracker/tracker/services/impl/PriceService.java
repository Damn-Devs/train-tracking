package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.*;
import com.tracker.tracker.models.request.FindPriceRequest;
import com.tracker.tracker.models.response.PriceResponse;
import com.tracker.tracker.models.response.TrainGetResponse;
import com.tracker.tracker.repositories.PriceRepository;
import com.tracker.tracker.repositories.ScheduleRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IPriceService;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PriceService implements IPriceService {
  private final ScheduleRepository scheduleRepository;
  private final PriceRepository priceRepository;
  private final UserDetailServiceImpl userDetailsService;
  private final UserRepository userRepository;

  @Override
  public double findPrice(FindPriceRequest findPriceRequest) {
    double totalPrice = 0;
    Schedule schedule = scheduleRepository.findById(findPriceRequest.getSchedule()).get();
    Price price = priceRepository.findByTrainClass(findPriceRequest.getTrainClass());
    List<TrainStation> fromStation =
        schedule.getTrain()
            .getTrainStations()
            .stream()
            .filter(trainStation -> trainStation.getStation().getId().equals(findPriceRequest.getFromStation())).collect(
                Collectors.toList());
    List<TrainStation> toStation =
        schedule.getTrain()
            .getTrainStations()
            .stream()
            .filter(trainStation -> trainStation.getStation().getId().equals(findPriceRequest.getToStation())).collect(
                Collectors.toList());

    int trainStations = 0;

    if(fromStation.size() > 0 && toStation.size() > 0){
      trainStations = toStation.get(0).getStationOrder() - fromStation.get(0).getStationOrder();
    }

    if(trainStations > 0){
      totalPrice = (price.getPrice() * findPriceRequest.getPassengerCount()) * trainStations;
    }

    return totalPrice;
  }

  @Override
  public List<PriceResponse> getPrice(UUID ticketTypeId) {
    return null;
  }

  @Override
  public List<PriceResponse> getAllPrices() {
    List<PriceResponse> priceResponses = new ArrayList<>();

    for (Price price :
            priceRepository.findAll()) {
      priceResponses.add(priceGetResponsesConverter(price));
    }
    return priceResponses;
  }

  @Override
  public void updatePrice(String price, UUID id, Principal principal) {
    UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
    Users user = userRepository.findById(userImpl.getId()).get();
    Price price1 = priceRepository.findById(id).get();
    price1.setPrice(Double.parseDouble(price));
    price1.setModifiedTime(OffsetDateTime.now());
    price1.setModifiedBy(user);
    priceRepository.save(price1);
  }

  private PriceResponse priceGetResponsesConverter(Price price) {
    PriceResponse priceGetResponse = new PriceResponse();
    priceGetResponse.setClas(price.getTrainClass());
    priceGetResponse.setPrice(String.valueOf(price.getPrice()));
    priceGetResponse.setId(price.getId());
    return priceGetResponse;
  }
}
