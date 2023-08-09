package com.tracker.tracker.repositories;
import com.tracker.tracker.models.entities.TrainStation;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TranStationRepository extends JpaRepository<TrainStation, UUID> {

}
