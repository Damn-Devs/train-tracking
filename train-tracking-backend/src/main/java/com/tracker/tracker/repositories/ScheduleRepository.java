package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Schedule;
import java.time.OffsetDateTime;
import java.util.Collection;

import com.tracker.tracker.models.entities.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {

    List<Schedule> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);

    List<Schedule> findDistinctByTrain_TrainStations_Station_IdInAndArrivalTimeBetween(Collection<UUID> ids, OffsetDateTime departureTimeStart, OffsetDateTime departureTimeEnd);

    List<Schedule> findByDeleted(Boolean deleted);

    List<Schedule> findByDeletedAndDepartureTimeBetween(Boolean deleted, OffsetDateTime departureTimeStart, OffsetDateTime departureTimeEnd);


    List<Schedule> findDistinctByArrivalTimeBetween(OffsetDateTime departureTimeStart, OffsetDateTime departureTimeEnd);

    List<Schedule> findByDepartureTimeBetween(OffsetDateTime departureTimeStart,
        OffsetDateTime departureTimeEnd);

    List<Schedule> findDistinctByTrain_TrainStations_Station_IdIn(Collection<UUID> ids);

    List<Schedule> findByTrain_IdAndDeletedOrderByDepartureStation_CreatedTimeDesc(UUID id, Boolean deleted);

    List<Schedule> findByTrain_IdAndCreatedTimeBetween(UUID id, OffsetDateTime createdTimeStart,
        OffsetDateTime createdTimeEnd);


    List<Schedule> findAllByTrain(Train train);
}
