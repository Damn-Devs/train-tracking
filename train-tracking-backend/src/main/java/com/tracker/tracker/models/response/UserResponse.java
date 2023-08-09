package com.tracker.tracker.models.response;

import lombok.Data;

import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String name;
}
