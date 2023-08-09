package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Train;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainRepository extends JpaRepository<Train, UUID> {
    Optional<Train> findByName(String name);
    List<Train> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);
}
