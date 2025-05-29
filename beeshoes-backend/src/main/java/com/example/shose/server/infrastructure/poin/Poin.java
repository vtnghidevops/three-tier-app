package com.example.shose.server.infrastructure.poin;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

/**
 * @author thangdt
 */
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Poin {
    @JsonProperty("exchangeRatePoin")
    private BigDecimal exchangeRatePoin;

    @JsonProperty("exchangeRateMoney")
    private BigDecimal exchangeRateMoney;

    @JsonProperty("minMoney")
    private BigDecimal minMoney;

    public int ConvertMoneyToPoints(BigDecimal totalMoney){
        return totalMoney.divide(exchangeRatePoin, 0, BigDecimal.ROUND_DOWN).intValue();

    }

    public BigDecimal  ConvertPoinToMoney(int poin){
        return BigDecimal.valueOf(poin).multiply(exchangeRateMoney);
    }

}
