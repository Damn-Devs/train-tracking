package com.tracker.tracker.models.json;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainChartStatistic {
    private String name;
    private int km;
    private double revenue;
}
