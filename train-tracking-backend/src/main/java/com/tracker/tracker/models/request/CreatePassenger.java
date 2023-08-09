package com.tracker.tracker.models.request;

import lombok.Data;

import java.util.UUID;
@Data
public class CreatePassenger {
    private UUID id;
    private String name;
    private String password;
    private String username;
    private String nic;
    private String dob;
    private String email;
    private String contact;

}
