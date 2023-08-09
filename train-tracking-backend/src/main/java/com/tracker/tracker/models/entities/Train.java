package com.tracker.tracker.models.entities;
import com.tracker.tracker.listener.TrainListener;
import java.time.OffsetDateTime;
import java.util.*;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(TrainListener.class)
@Entity
public class Train {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private UUID id;
  private String name;
  private int firstClassCount;
  private int secondClassCount;
  private int thirdClassCount;
  private Boolean deleted =false;
  @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "train_id")
  @OrderBy("stationOrder ASC")
  private Set<TrainStation> trainStations = new HashSet<>();
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
