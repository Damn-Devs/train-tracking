package com.tracker.tracker.models.json;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String name;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, UUID id, String name, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}
