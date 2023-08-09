package com.tracker.tracker.models.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tracker.tracker.models.entities.Role;
import com.tracker.tracker.models.entities.Users;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class UserCreateRequest {
    private UUID id;
    @NotBlank
    @NotNull
    @NotEmpty
    private String name;
    @Email
    private String email;
    @NotBlank @NotNull @NotEmpty
    private String username;
    @NotBlank @NotNull @NotEmpty
    private String password;
    private Set<UUID> roleIds;
}
