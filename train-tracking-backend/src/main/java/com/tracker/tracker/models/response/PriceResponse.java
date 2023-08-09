package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class PriceResponse {
    private UUID id;
    private String clas;
    private String price;
}
