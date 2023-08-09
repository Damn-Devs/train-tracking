package com.tracker.tracker.models.request;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Data;

@Data
public class FindTrainRequest {
  private UUID fromStation;
  private UUID toStation;
  private OffsetDateTime fromDate;
  private OffsetDateTime toDate;
  private String train_class;
  private int passengerCount;
}
