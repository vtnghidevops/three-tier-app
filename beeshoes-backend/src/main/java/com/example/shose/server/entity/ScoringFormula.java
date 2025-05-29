package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.Status;
import jakarta.persistence.*;
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
@Table(name = "scoring_formula")
@AllArgsConstructor
@NoArgsConstructor
public class ScoringFormula extends PrimaryEntity {

    @Column(name = "exchange_rate_poin")
    private BigDecimal exchangeRatePoin;

    @Column(name = "exchange_rate_money")
    private BigDecimal exchangeRateMoney;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Transient
    public int ConvertMoneyToPoints(BigDecimal totalMoney){
        return totalMoney.divide(exchangeRatePoin, 0, BigDecimal.ROUND_DOWN).intValue();
    }
    @Transient
    public BigDecimal  ConvertPoinToMoney(int poin){
        return BigDecimal.valueOf(poin).multiply(exchangeRateMoney);
    }
}
