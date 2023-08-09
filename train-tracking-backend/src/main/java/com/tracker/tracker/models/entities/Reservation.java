package com.tracker.tracker.models.entities;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private UUID id;
  private String trainClass;
  private int seatNumber;
  private Boolean deleted =false;
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
