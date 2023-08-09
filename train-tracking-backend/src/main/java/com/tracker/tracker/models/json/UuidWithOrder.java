package com.tracker.tracker.models.json;

import java.util.UUID;
import lombok.Data;

@Data
public class UuidWithOrder {
  private UUID id;
  private int order;
}
