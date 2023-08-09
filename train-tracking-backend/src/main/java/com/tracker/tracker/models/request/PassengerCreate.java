package com.tracker.tracker.models.request;

import java.util.UUID;
import lombok.Data;

@Data
public class PassengerCreate {
  private UUID id;
  private String name;
  private String email;
  private String nic;
  private String contact;
  private String username;
  private String password;
}
