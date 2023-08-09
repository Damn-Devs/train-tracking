package com.tracker.tracker.models.response;

import java.util.UUID;
import lombok.Data;

@Data
public class PassengerGetResponse {
  private UUID id;
  private String name;
  private String email;
  private String nic;
  private String contact;
  private String username;
}
