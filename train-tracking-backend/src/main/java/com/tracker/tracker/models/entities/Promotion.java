package com.tracker.tracker.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;
    private String clas;
    private String code;
    private String round;
    private double discount;
    private Boolean deleted =false;
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

}
