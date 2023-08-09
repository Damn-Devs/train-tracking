package com.tracker.tracker.models.entities;
import com.tracker.tracker.listener.BookingListener;
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
@EntityListeners(BookingListener.class)
@NoArgsConstructor
@Entity
public class Booking {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private UUID id;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "reservation_id")
  private Reservation reservation;
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "passenger_id")
  private Passenger passenger;
  private String ticket_number;
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "travel_from_id")
  private Station travel_from;
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "travel_to_id")
  private Station travel_to;
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "payment_id")
  private Payment payment;
  private Boolean status = false;
  private Boolean deleted =false;
  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "schedule_id")
  private Schedule schedule;
//  @OneToOne(cascade = CascadeType.ALL)
//  @JoinColumn(name = "schedule_id")
//  private Schedule schedule;
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
