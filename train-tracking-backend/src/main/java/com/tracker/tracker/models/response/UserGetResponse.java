package com.tracker.tracker.models.response;

import com.tracker.tracker.models.json.IdWithName;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
@Data
public class UserGetResponse {
    private UUID id;
    private String name;
    private String email;
    private String username;
    private Boolean active;
    private Boolean delete;
    private Set<IdWithName> roleIds;
    private String createdBy;
    private String modifiedBy;
    private OffsetDateTime lastModified;
}
