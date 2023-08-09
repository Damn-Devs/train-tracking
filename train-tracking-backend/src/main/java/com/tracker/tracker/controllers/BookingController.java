package com.tracker.tracker.controllers;

import com.tracker.tracker.models.json.TrainStatics;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.BookingCreate;
import com.tracker.tracker.models.response.BookingResponse;
import com.tracker.tracker.services.IBookingService;
import com.tracker.tracker.services.IBookingService;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/booking")
public class BookingController {
    private final IBookingService bookingService;

    @PreAuthorize("hasAnyAuthority('Super Admin', 'Passenger')")
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingCreate bookingRequest,
                                           Principal principal) {
        return ResponseEntity.ok(bookingService.bookingCreate(bookingRequest, principal));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable UUID id, @Valid @RequestBody BookingCreate bookingRequest,
                                           Principal principal) {
        BookingResponse savedBooking = bookingService.updateBooking(id, bookingRequest, principal);
        return ResponseEntity.ok(savedBooking);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/getubooking")
    public ResponseEntity<?> getAllBooking(@RequestParam(value = "bookingId", required = false)UUID bookingId){
        if (bookingId != null) {
            return ResponseEntity.ok(bookingService.getBooking(bookingId));
        } else {
            return ResponseEntity.ok(bookingService.getAllBooking());
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteBooking(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        BookingResponse bookingResponse = bookingService.deleteBooking(deleteRequest, principal);
        return ResponseEntity.ok(bookingResponse);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/count")
    public ResponseEntity<?> bookingCount() {
        Long bookingCount = bookingService.bookingCount();
        return ResponseEntity.ok(Objects.requireNonNullElse(bookingCount,0));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/chart/train/statics")
    public ResponseEntity<?> getTrainStatics() {
        List<TrainStatics> trainStatics = bookingService.getTrainStatics();
        return ResponseEntity.ok(trainStatics);
    }
}
