package com.tracker.tracker.listener;

import com.tracker.tracker.models.entities.Reservation;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationListener {
  private final SimpMessagingTemplate simpMessagingTemplate;

  @PostUpdate
  @PostRemove
  @PostPersist
  public void onChange(final Reservation reservation){
    simpMessagingTemplate.convertAndSend("/dashboard/reservation/change", reservation);
  }
}
