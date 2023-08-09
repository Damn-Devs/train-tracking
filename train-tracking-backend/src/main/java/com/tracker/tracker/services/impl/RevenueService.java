package com.tracker.tracker.services.impl;

import com.tracker.tracker.models.entities.Booking;
import com.tracker.tracker.models.entities.Payment;
import com.tracker.tracker.models.entities.Schedule;
import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.response.FirstClassRevenueResponse;
import com.tracker.tracker.models.response.RevenueResponse;
import com.tracker.tracker.models.response.SecondClassRevenueResponse;
import com.tracker.tracker.models.response.ThirdClassRevenueResponse;
import com.tracker.tracker.repositories.*;
import com.tracker.tracker.services.IRevenueService;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RevenueService implements IRevenueService {
    private final TrainRepository trainRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;

    public RevenueResponse getTotalRevenue(String trainName) {
        // The train name acts as a unique identifier for each train.
        // 1. Get the train that has the provided train name
        Train train = trainRepository.findByName(trainName).get();

        // 2. Get all  the schedule records for that train's ID
        List<Schedule> schedules = scheduleRepository.findAllByTrain(train);

        // 3. Get the booking ID whose records contain that schedule ID
        // There is a 1 to 1 mapping between booking and schedule. I have to get each booking for each schedule
        List<Booking> bookings = new ArrayList<>();
        schedules.forEach(schedule -> {
            bookings.add(bookingRepository.findBySchedule(schedule).get());
        });

        // 4. From the booking ID, get the payment ID
        // Each booking has a payment associated with it.... add each payment into the payments array list
        List<Payment> payments = new ArrayList<>();
        bookings.forEach(booking -> {
            payments.add(booking.getPayment());
        });

        // 5. From the payment ID, get the total amount paid for that payment
        double total = 0;
        for (Payment payment : payments) {
            total += payment.getTotal();
        }

        return null;
    }

    @Override
    public RevenueResponse getRevenueOverview(String trainName) throws IllegalStateException {
        // 1. Get all the schedules for the train
        if (!trainRepository.findByName(trainName).isPresent()) {
            throw new IllegalStateException(String.format("Train name does not exist: %s", trainName));
        }

        int year = OffsetDateTime.now().getYear();
        OffsetDateTime firstDate = OffsetDateTime.of(year, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime lastDate = OffsetDateTime.of(year, 12, 31, 23, 59, 59, 999_999_999, ZoneOffset.UTC);

        Train train = trainRepository.findByName(trainName).get();
        List<Schedule> schedules =
            scheduleRepository.findByTrain_IdAndCreatedTimeBetween(train.getId(), firstDate, lastDate);

        // 2.For each schedule, get all the bookings and categorize the bookings based on the seat class
        List<Booking> firstClassBookings = new ArrayList<>();
        List<Booking> secondClassBookings = new ArrayList<>();
        List<Booking> thirdClassBookings = new ArrayList<>();

// UNCOMMENT THIS:
        for (Schedule schedule : schedules) {
            if(!bookingRepository.findBySchedule(schedule).isPresent()) {
                throw new IllegalStateException("Booking not found");
            }
            Booking booking = bookingRepository.findBySchedule(schedule).get();

            // 2.1 Categorize the bookings
            String seatClass = booking.getReservation().getTrainClass();
            if(seatClass.equalsIgnoreCase("first")) {
                firstClassBookings.add(booking);
            }
            else if(seatClass.equalsIgnoreCase("second")) {
                secondClassBookings.add(booking);
            }
            else if(seatClass.equalsIgnoreCase("third")) {
                thirdClassBookings.add(booking);
            }
            else {
                throw new IllegalStateException(String.format("Invalid seat class: %s", seatClass));
            }
        }

        // 3. Calculate revenue data
        // 3.1 First class bookings
        double firstClassTotalRevenue = 0;
        int firstClassTicketBooked = 0;
        int firstClassTicketSold = 0;
        for (Booking firstClassBooking : firstClassBookings) {
            firstClassTotalRevenue += firstClassBooking.getPayment().getTotal();
            firstClassTicketBooked += 1;
            firstClassTicketSold += firstClassBooking.getReservation().getSeatNumber();
        }

        // 3.2 Second class bookings
        double secondClassTotalRevenue = 0;
        int secondClassTicketBooked = 0;
        int secondClassTicketSold = 0;
        for (Booking secondClassBooking : secondClassBookings) {
            secondClassTotalRevenue += secondClassBooking.getPayment().getTotal();
            secondClassTicketBooked += 1;
            secondClassTicketSold += secondClassBooking.getReservation().getSeatNumber();
        }

        // 3.3 Third class bookings
        double thirdClassTotalRevenue = 0;
        int thirdClassTicketBooked = 0;
        int thirdClassTicketSold = 0;
        for (Booking thirdClassBooking : thirdClassBookings) {
            thirdClassTotalRevenue += thirdClassBooking.getPayment().getTotal();
            thirdClassTicketBooked += 1;
            thirdClassTicketSold += thirdClassBooking.getReservation().getSeatNumber();
        }

        double avg =
            (firstClassTotalRevenue + secondClassTotalRevenue + thirdClassTotalRevenue) / 3;

        float firstClassProportion =
            (float) ((firstClassTotalRevenue / (firstClassTotalRevenue + secondClassTotalRevenue + thirdClassTotalRevenue)) * 100);
        float secondClassProportion =
            (float) ((secondClassTotalRevenue / (firstClassTotalRevenue + secondClassTotalRevenue + thirdClassTotalRevenue)) * 100);;
        float thirdClassProportion =
            (float) ((thirdClassTotalRevenue / (firstClassTotalRevenue + secondClassTotalRevenue + thirdClassTotalRevenue)) * 100);;

        // 4.  Generate the revenue response
        FirstClassRevenueResponse firstClassRevenue = FirstClassRevenueResponse.builder()
                .revenueProportion(firstClassProportion)
                .averageSellingRate(avg)
                .ticketsBooked(firstClassTicketBooked)
                .ticketsSold(firstClassTicketSold)
                .total(firstClassTotalRevenue)
                .build();

        SecondClassRevenueResponse secondClassRevenue = SecondClassRevenueResponse.builder()
                .revenueProportion(secondClassProportion)
                .averageSellingRate(avg)
                .ticketsBooked(secondClassTicketBooked)
                .ticketsSold(secondClassTicketSold)
                .total(secondClassTotalRevenue)
                .build();

        ThirdClassRevenueResponse thirdClassRevenue = ThirdClassRevenueResponse.builder()
                .revenueProportion(thirdClassProportion)
                .averageSellingRate(avg)
                .ticketsBooked(thirdClassTicketBooked)
                .ticketsSold(thirdClassTicketSold)
                .total(thirdClassTotalRevenue)
                .build();

        RevenueResponse response = RevenueResponse.builder()
                .firstClassRevenueResponse(firstClassRevenue)
                .secondClassRevenueResponse(secondClassRevenue)
                .thirdClassRevenueResponse(thirdClassRevenue)
                .totalRevenue(firstClassTotalRevenue + secondClassTotalRevenue + thirdClassTotalRevenue)
                .build();

        return response;
    }
}
