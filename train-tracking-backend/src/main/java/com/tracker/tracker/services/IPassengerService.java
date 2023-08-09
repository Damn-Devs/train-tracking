package com.tracker.tracker.services;

import com.tracker.tracker.models.entities.Booking;
import com.tracker.tracker.models.entities.Passenger;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.PassengerCreate;
import com.tracker.tracker.models.response.PassengerGetResponse;
import com.tracker.tracker.models.response.PassengerResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IPassengerService {
  PassengerResponse passengerCreate(PassengerCreate passengerRequest);

  PassengerResponse passengerUpdate(UUID id, PassengerCreate passengerRequest, Principal principal);

  PassengerGetResponse getPassenger(UUID passengerId);

  List<PassengerGetResponse> getAllPassenger();

  List<Booking> onGoingActivities(Principal principal);

  List<Booking> completedActivities(Principal principal);

  // REMOVE-THIS
  PassengerResponse passengerDelete(DeleteRequest deleteRequest, Principal principal);

  double checkPromo(String promo, double price, UUID userId);

  Passenger getPassengerByUserId(UUID id);
  // ----------------------------------------------------------------------------------

}
