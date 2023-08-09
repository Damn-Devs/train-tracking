package com.tracker.tracker.models.entities;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private UUID id;
  private String method;
  private double total;
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
