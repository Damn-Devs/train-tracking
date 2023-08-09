package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Passenger;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerRepository extends JpaRepository<Passenger, UUID> {

  Passenger findByUser_Id(UUID id);

  List<Passenger> findByDeleted(Boolean deleted);

  boolean existsByPromotions_CodeAndId(String code, UUID id);


}