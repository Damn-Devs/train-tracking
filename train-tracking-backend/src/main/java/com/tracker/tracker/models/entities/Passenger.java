package com.tracker.tracker.models.entities;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
public class Passenger {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private UUID id;
  private String nic;
  private String contact;
  private Boolean deleted =false;
  @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.REFRESH})
  @JoinTable(
      name = "passenger_promotion",
      joinColumns = @JoinColumn(name = "passenger_id"),
      inverseJoinColumns = @JoinColumn(name = "promotion_id")
  )
  private List<Promotion> promotions = new ArrayList<>();
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

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "user_id")
  private Users user;

}
