package com.tracker.tracker.listener;

import com.tracker.tracker.models.entities.Booking;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class BookingListener {
  private final SimpMessagingTemplate simpMessagingTemplate;

  @PostPersist
  @PostRemove
  @PostUpdate
  public void onChange(final Booking booking){
    simpMessagingTemplate.convertAndSend("/dashboard/booking/change", booking);
  }
}
