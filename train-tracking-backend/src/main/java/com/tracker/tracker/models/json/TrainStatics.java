package com.tracker.tracker.models.json;

import java.util.List;
import lombok.Data;

@Data
public class TrainStatics {
  private String label;
  private List<Double> data;
}
