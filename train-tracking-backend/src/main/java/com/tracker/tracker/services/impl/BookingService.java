package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Booking;
import com.tracker.tracker.models.entities.Passenger;
import com.tracker.tracker.models.entities.Payment;
import com.tracker.tracker.models.entities.Reservation;
import com.tracker.tracker.models.entities.Schedule;
import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.json.TrainStatics;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.BookingCreate;
import com.tracker.tracker.models.response.BookingGetResponse;
import com.tracker.tracker.models.response.BookingResponse;
import com.tracker.tracker.repositories.*;
import com.tracker.tracker.repositories.BookingRepository;
import com.tracker.tracker.services.IBookingService;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class BookingService implements IBookingService {
    private final UserRepository usersRepository;
    private final BookingRepository bookingRepository;
    private final UserDetailServiceImpl userDetailsService;
    private final ScheduleRepository scheduleRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PassengerRepository passengerRepository;
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final MailService mailService;
    @Override
    public BookingResponse bookingCreate(BookingCreate bookingRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();

        Booking newBooking = new Booking();
        Schedule schedule = scheduleRepository.findById(bookingRequest.getScheduleId()).get();
        Passenger passenger = passengerRepository.findByUser_Id(user.getId());
        Station fromStation = stationRepository.findById(bookingRequest.getTravelFromID()).get();
        Station toStation = stationRepository.findById(bookingRequest.getTravelFromID()).get();

        Payment payment = new Payment();
        payment.setMethod(bookingRequest.getMethod());
        payment.setTotal(bookingRequest.getTotal());
        payment.setCreatedBy(user);
        payment.setCreatedTime(OffsetDateTime.now());
        Payment newPayment = paymentRepository.save(payment);

        Reservation reservation = new Reservation();
        reservation.setSeatNumber(bookingRequest.getReservation().getSeatNumber());
        reservation.setTrainClass(bookingRequest.getReservation().getTrainClass());
        reservation.setCreatedBy(user);
        reservation.setCreatedTime(OffsetDateTime.now());
        Reservation newReservation = reservationRepository.save(reservation);

        newBooking.setSchedule(schedule);
        newBooking.setReservation(newReservation);
        newBooking.setPayment(newPayment);
        newBooking.setCreatedBy(user);
        newBooking.setTravel_from(fromStation);
        newBooking.setTravel_to(toStation);
        newBooking.setPassenger(passenger);
        newBooking.setCreatedTime(OffsetDateTime.now());
        newBooking.setModifiedTime(OffsetDateTime.now());

        if(reservation.getTrainClass().equals("First")){
            schedule.setFirstClassAvailable(schedule.getFirstClassAvailable() - reservation.getSeatNumber());
        } else if(reservation.getTrainClass().equals("Second")){
            schedule.setSecondClassAvailable(schedule.getSecondClassAvailable() - reservation.getSeatNumber());
        } else if(reservation.getTrainClass().equals("Third")){
            schedule.setThirdClassAvailable(schedule.getThirdClassAvailable() - reservation.getSeatNumber());
        }

        

        scheduleRepository.save(schedule);

        Schedule schedule1 = scheduleRepository.save(schedule);
        OffsetDateTime now = OffsetDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = now.format(formatter);

        String trainName = schedule1.getTrain().getName();
        String from = schedule1.getDepartureStation().getName();
        String to = schedule1.getArrivalStation().getName();
        double price = newBooking.getPayment().getTotal();
        String confirmationMessage = "Your booking is confirmed successfully.\n" +
            "First class - 2 seats are reserved for you\n" +
            "Booking Details,\n" +
            "Train Name - " + trainName + "\n" +
            "Date - " + formattedDate + "\n" +
            "From - " + from + "\n" +
            "To - " + to + "\n" +
            "Price - " + price + " LKR\n";
        mailService.sendSimpleMail("Train Booking Confirmation Mail",user.getEmail(), confirmationMessage);

        return BookingResponseConvertor(bookingRepository.save(newBooking));
    }


    @Override
    public BookingResponse updateBooking(UUID id, BookingCreate createBooking, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Booking updateBooking = bookingRepository.findById(id).get();
        
        updateBooking.setModifiedBy(user);
        updateBooking.setModifiedTime(OffsetDateTime.now());
        return BookingResponseConvertor(bookingRepository.save(updateBooking));
    }

    @Override
    public List<BookingGetResponse> getBooking(UUID bookingId) {
        List<BookingGetResponse> bookingGetResponses = new ArrayList<>();
        {
            if (bookingRepository.findAll().size()>0) {
                bookingGetResponses.add(bookingGetResponsesConverter(bookingRepository.findById(bookingId).get()));
            }
        }
        return bookingGetResponses;
    }

    @Override
    public List<BookingGetResponse> getAllBooking() {
        List<BookingGetResponse> bookingGetResponses = new ArrayList<>();

        for (Booking booking :
                bookingRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
            bookingGetResponses.add(bookingGetResponsesConverter(booking));
        }
        return bookingGetResponses;
    }

    @Override
    public BookingResponse deleteBooking(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Booking DeleBooking =
                bookingRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DeleBooking .setDeleted(deleteRequest.getDelete());
        DeleBooking .setModifiedBy(user);
        DeleBooking .setModifiedTime(OffsetDateTime.now());

        return BookingResponseConvertor(bookingRepository.save(DeleBooking));
    }

    @Override
    public Long bookingCount() {
        return bookingRepository.count();
    }

    @Override
    public List<TrainStatics> getTrainStatics() {
        int year = OffsetDateTime.now().getYear();
        OffsetDateTime firstDate = OffsetDateTime.of(year, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime lastDate = OffsetDateTime.of(year, 12, 31, 23, 59, 59, 999_999_999, ZoneOffset.UTC);

        List<Train> trains = trainRepository.findAll();

        List<TrainStatics> trainStatics = new ArrayList<>();

        for (Train train: trains) {
            List<Booking> bookings =
                bookingRepository.findBySchedule_Train_IdAndCreatedTimeBetween(train.getId(),
                    firstDate, lastDate);

            TrainStatics trainStatic = new TrainStatics();
            trainStatic.setLabel(train.getName());

            List<Double> data = new ArrayList<>();
            for (int i = 0; i < 12; i++) {
                data.add(0.0);
            }

            for (Booking booking:bookings) {
                switch (booking.getPayment().getCreatedTime().getMonth()){
                    case JANUARY:
                        data.set(0, data.get(0) + booking.getPayment().getTotal());
                        break;
                    case FEBRUARY:
                        data.set(1, data.get(1) + booking.getPayment().getTotal());
                        break;
                    case MARCH:
                        data.set(2, data.get(2) + booking.getPayment().getTotal());
                        break;
                    case APRIL:
                        data.set(3, data.get(3) + booking.getPayment().getTotal());
                        break;
                    case MAY:
                        data.set(4, data.get(4) + booking.getPayment().getTotal());
                        break;
                    case JUNE:
                        data.set(5, data.get(5) + booking.getPayment().getTotal());
                        break;
                    case JULY:
                        data.set(6, data.get(6) + booking.getPayment().getTotal());
                        break;
                    case AUGUST:
                        data.set(7, data.get(7) + booking.getPayment().getTotal());
                        break;
                    case SEPTEMBER:
                        data.set(8, data.get(8) + booking.getPayment().getTotal());
                        break;
                    case OCTOBER:
                        data.set(9, data.get(9) + booking.getPayment().getTotal());
                        break;
                    case NOVEMBER:
                        data.set(10, data.get(10) + booking.getPayment().getTotal());
                        break;
                    case DECEMBER:
                        data.set(11, data.get(11) + booking.getPayment().getTotal());
                        break;
                }
            }

            trainStatic.setData(data);
            trainStatics.add(trainStatic);
        }

        return trainStatics;
    }

    private BookingGetResponse bookingGetResponsesConverter(Booking booking) {
        BookingGetResponse bookingGetResponse = new BookingGetResponse();
        bookingGetResponse.setId(booking.getId());


        return bookingGetResponse;
    }

    private BookingResponse BookingResponseConvertor(Booking booking) {
        BookingResponse bookingGetResponse = new BookingResponse();
        bookingGetResponse.setId(booking.getId());
        return bookingGetResponse;
    }
}
