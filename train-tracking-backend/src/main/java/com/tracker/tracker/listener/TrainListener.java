package com.tracker.tracker.listener;

import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.repositories.TrainRepository;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TrainListener {
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostPersist
    @PostRemove
    @PostUpdate
    public void onChange(final Train train){
        System.out.println("update train with ws");
      simpMessagingTemplate.convertAndSend("/dashboard/train/change", train);
    }
}
