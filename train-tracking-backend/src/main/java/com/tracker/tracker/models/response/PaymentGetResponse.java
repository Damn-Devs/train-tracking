package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentGetResponse {
    private UUID id;
    private String method;
    private double total;
}
