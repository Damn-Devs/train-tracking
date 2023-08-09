package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Booking;

import java.awt.print.Book;
import java.time.OffsetDateTime;

import com.tracker.tracker.models.entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);

    List<Booking> findByCreatedBy_IdAndSchedule_ArrivalTimeGreaterThan(UUID id,
        OffsetDateTime arrivalTime);



    List<Booking> findByCreatedBy_IdAndSchedule_ArrivalTimeLessThan(UUID id,
        OffsetDateTime arrivalTime);

    List<Booking> findBySchedule_Train_IdAndCreatedTimeBetween(UUID id,
        OffsetDateTime createdTimeStart, OffsetDateTime createdTimeEnd);

    Optional<Booking> findBySchedule(Schedule schedule);

    List<Booking> findBySchedule_IdAndSchedule_ArrivalTimeGreaterThan(UUID id,
        OffsetDateTime arrivalTime);

    List<Booking> findBySchedule_Train_NameAndCreatedTimeBetween(String name,
        OffsetDateTime createdTimeStart, OffsetDateTime createdTimeEnd);





}
