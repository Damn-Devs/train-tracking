package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class PromoGetResponse {
    private UUID id;
    private String clas;
    private String code;
    private String round;
    private String discount;
}
