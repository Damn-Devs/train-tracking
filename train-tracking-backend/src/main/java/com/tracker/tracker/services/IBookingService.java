package com.tracker.tracker.services;

import com.tracker.tracker.models.json.TrainStatics;
import com.tracker.tracker.models.request.BookingCreate;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.BookingGetResponse;
import com.tracker.tracker.models.response.BookingResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IBookingService {
    BookingResponse  bookingCreate(BookingCreate bookingRequest, Principal principal);

    BookingResponse updateBooking(UUID id, BookingCreate bookingRequest, Principal principal);

    List<BookingGetResponse> getBooking(UUID bookingId);

    List<BookingGetResponse> getAllBooking();

    BookingResponse deleteBooking(DeleteRequest deleteRequest, Principal principal);

    Long bookingCount();

  List<TrainStatics> getTrainStatics();
}
