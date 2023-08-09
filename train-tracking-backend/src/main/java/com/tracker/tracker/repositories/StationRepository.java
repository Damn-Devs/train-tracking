package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Train;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface StationRepository extends JpaRepository<Station,UUID> {
    Optional<Station> findByName(String name);

    List<Station> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);
}
