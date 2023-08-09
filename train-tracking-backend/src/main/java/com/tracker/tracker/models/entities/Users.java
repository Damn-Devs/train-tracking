package com.tracker.tracker.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String email;
    private String username;
    private String password;
    private Boolean deleted = false;
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.REFRESH})
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.REFRESH)
    private Users createdBy;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.REFRESH)
    private Users modifiedBy;
    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE", insertable = true, updatable = false)
    private OffsetDateTime createdTime = OffsetDateTime.now();
    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE", insertable = true, updatable = true)
    private OffsetDateTime modifiedTime = OffsetDateTime.now();

    @Override
    public String toString() {
        return "";
    }
}