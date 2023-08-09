package com.tracker.tracker.services;

import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.ReservationRequest;
import com.tracker.tracker.models.response.ReservationGetResponse;
import com.tracker.tracker.models.response.ReservationResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IReservationService {
    ReservationResponse reservationRequest(ReservationRequest reservationRequest, Principal principal);

    ReservationResponse updateReservation(UUID id, ReservationRequest reservationRequest, Principal principal);

    List<ReservationGetResponse> getReservation(UUID reservationId);

    List<ReservationGetResponse> getAllReservation();

    ReservationResponse deleteReservation(DeleteRequest deleteRequest, Principal principal);

    Integer ticketSalesCount();
}
