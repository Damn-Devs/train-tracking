package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Payment;
import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);

    @Query(value = "SELECT SUM(total) FROM payment", nativeQuery = true)
    Double getAllRevenue();

    List<Payment> findByCreatedTimeBetween(OffsetDateTime createdTimeStart,
        OffsetDateTime createdTimeEnd);


}
