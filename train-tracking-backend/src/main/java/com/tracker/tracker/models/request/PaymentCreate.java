package com.tracker.tracker.models.request;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentCreate {
    private UUID id;
    private String method;
    private double total;

}
