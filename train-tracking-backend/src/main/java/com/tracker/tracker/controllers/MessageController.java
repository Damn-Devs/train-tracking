package com.tracker.tracker.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class MessageController {

  @MessageMapping("/application")
  @SendTo("/all/message")
  public Message send(final Message message) throws Exception {
    return message;
  }
}
