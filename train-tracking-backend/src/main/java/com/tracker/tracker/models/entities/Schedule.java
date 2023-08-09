package com.tracker.tracker.models.entities;
import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Schedule {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private UUID id;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "departure_station_id")
  private Station departureStation;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "arrival_station_id")
  private Station arrivalStation;
  private OffsetDateTime departureTime;
  private OffsetDateTime arrivalTime;
  private int delay;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "station_id")
  private Station location;
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "train_id")
  private Train train;
  private Boolean deleted =false;
  private int firstClassAvailable;
  private int secondClassAvailable;
  private int thirdClassAvailable;
  @JsonIgnore
  @ManyToOne(cascade = CascadeType.REFRESH)
  private Users createdBy;
  @JsonIgnore
  @ManyToOne(cascade = CascadeType.REFRESH)
  private Users modifiedBy;
  @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE", insertable = true, updatable = false)
  private OffsetDateTime createdTime = OffsetDateTime.now();
  @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE", insertable = true, updatable = true)
  private OffsetDateTime modifiedTime = OffsetDateTime.now();
}

