package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Price;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceRepository extends JpaRepository<Price, UUID> {

  Price findByTrainClass(String trainClass);



}
