package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Reservation;
import com.tracker.tracker.models.entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    List<Reservation> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);

    @Query(value = "SELECT SUM(seatnumber) FROM reservation", nativeQuery = true)
    Integer ticketSalesCount();
}
