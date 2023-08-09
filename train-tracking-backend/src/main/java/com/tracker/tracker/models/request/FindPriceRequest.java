package com.tracker.tracker.models.request;

import java.util.UUID;
import lombok.Data;

@Data
public class FindPriceRequest {
  private String trainClass;
  private UUID schedule;
  private UUID fromStation;
  private UUID toStation;
  private int passengerCount;
}
