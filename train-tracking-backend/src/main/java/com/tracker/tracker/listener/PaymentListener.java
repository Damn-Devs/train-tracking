package com.tracker.tracker.listener;

import com.tracker.tracker.models.entities.Payment;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class PaymentListener {
  private final SimpMessagingTemplate simpMessagingTemplate;

  @PostPersist
  @PostRemove
  @PostUpdate
  public void onChange(final Payment payment){
    simpMessagingTemplate.convertAndSend("/dashboard/payment/change");
  }
}
