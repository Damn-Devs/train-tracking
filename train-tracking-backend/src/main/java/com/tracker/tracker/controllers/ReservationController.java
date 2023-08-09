package com.tracker.tracker.controllers;

import com.tracker.tracker.models.entities.Reservation;
import com.tracker.tracker.models.request.ReservationRequest;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.ReservationRequest;
import com.tracker.tracker.models.response.ReservationResponse;
import com.tracker.tracker.repositories.ReservationRepository;
import com.tracker.tracker.repositories.ReservationRepository;
import com.tracker.tracker.services.IReservationService;
import com.tracker.tracker.services.IReservationService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/reservation")
public class ReservationController {
    private final IReservationService reservationService;

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create")
    public ResponseEntity<?> reservationCreate(@Valid @RequestBody ReservationRequest reservationRequest,
                                           Principal principal) {
            return ResponseEntity.ok(reservationService.reservationRequest(reservationRequest, principal));
    }
    
    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable UUID id,
                                           @Valid @RequestBody ReservationRequest reservationRequest,
                                           Principal principal) {
        ReservationResponse savedReservation = reservationService.updateReservation(id, reservationRequest, principal);
        return ResponseEntity.ok(savedReservation);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/getureservation")
    public ResponseEntity<?> getAllReservation(@RequestParam(value = "reservationId", required = false)UUID reservationId){
        if (reservationId != null) {
            return ResponseEntity.ok(reservationService.getReservation(reservationId));
        } else {
            return ResponseEntity.ok(reservationService.getAllReservation());
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteReservation(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        ReservationResponse reservationResponse = reservationService.deleteReservation(deleteRequest, principal);
        return ResponseEntity.ok(reservationResponse);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/ticket/sales/count")
    public ResponseEntity<?> ticketSalesCount() {
        Integer ticketSalesCount = reservationService.ticketSalesCount();

        return ResponseEntity.ok(Objects.requireNonNullElse(ticketSalesCount,0));
    }
}
