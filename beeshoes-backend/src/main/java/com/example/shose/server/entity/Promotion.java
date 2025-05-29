package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusPromotion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "promotion")
@AllArgsConstructor
@NoArgsConstructor
public class Promotion extends PrimaryEntity {

    private String code;

    private String name;

    private BigDecimal value;

    @Column(name = "start_date")
    private Long startDate;

    @Column(name = "end_date")
    private Long endDate;

    @Enumerated(EnumType.STRING)
    private StatusPromotion status;
}