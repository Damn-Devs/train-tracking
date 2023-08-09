package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Reservation;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.request.ReservationRequest;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.ReservationResponse;
import com.tracker.tracker.models.response.ReservationGetResponse;
import com.tracker.tracker.repositories.ReservationRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ReservationService implements IReservationService {
    private final UserRepository usersRepository;
    private final ReservationRepository reservationRepository;
    private final UserDetailServiceImpl userDetailsService;
    @Override
    public ReservationResponse reservationRequest(ReservationRequest reservationRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();

        Reservation newReservation =new Reservation();
        newReservation.setSeatNumber(reservationRequest.getSeatNumber());
        newReservation.setTrainClass(reservationRequest.getTrainClass());
        newReservation.setCreatedBy(user);
        newReservation.setCreatedTime(OffsetDateTime.now());
        newReservation.setModifiedTime(OffsetDateTime.now());
        return ReservationResponseConvertor(reservationRepository.save(newReservation));
    }

    @Override
    public ReservationResponse updateReservation(UUID id, ReservationRequest createReservation, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Reservation updateReservation = reservationRepository.findById(id).get();
        updateReservation.setSeatNumber(createReservation.getSeatNumber());
        updateReservation.setTrainClass(createReservation.getTrainClass());
        updateReservation.setModifiedBy(user);
        updateReservation.setModifiedTime(OffsetDateTime.now());
        return ReservationResponseConvertor(reservationRepository.save(updateReservation));
    }

    @Override
    public List<ReservationGetResponse> getReservation(UUID reservationId) {
        List<ReservationGetResponse> reservationGetResponses = new ArrayList<>();
        {
            if (reservationRepository.findAll().size()>0) {
                reservationGetResponses.add(reservationGetResponsesConverter(reservationRepository.findById(reservationId).get()));
            }
        }
        return reservationGetResponses;
    }

    @Override
    public List<ReservationGetResponse> getAllReservation() {
        List<ReservationGetResponse> reservationGetResponses = new ArrayList<>();

        for (Reservation reservation :
                reservationRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
            reservationGetResponses.add(reservationGetResponsesConverter(reservation));
        }
        return reservationGetResponses;
    }

    @Override
    public ReservationResponse deleteReservation(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Reservation DeleReservation =
                reservationRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DeleReservation .setDeleted(deleteRequest.getDelete());
        DeleReservation .setModifiedBy(user);
        DeleReservation .setModifiedTime(OffsetDateTime.now());

        return ReservationResponseConvertor(reservationRepository.save(DeleReservation));
    }

    @Override
    public Integer ticketSalesCount() {
        return reservationRepository.ticketSalesCount();
    }

    private ReservationGetResponse reservationGetResponsesConverter(Reservation reservation) {
        ReservationGetResponse stationGetResponse = new ReservationGetResponse();
        stationGetResponse.setId(reservation.getId());
        stationGetResponse.setSeatNumber(reservation.getSeatNumber());
        stationGetResponse.setTrainClass(reservation.getTrainClass());

        return stationGetResponse;
    }

    private ReservationResponse ReservationResponseConvertor(Reservation reservation) {
        ReservationResponse stationGetResponse = new ReservationResponse();
        stationGetResponse.setId(reservation.getId());
        return stationGetResponse;
    }
}
