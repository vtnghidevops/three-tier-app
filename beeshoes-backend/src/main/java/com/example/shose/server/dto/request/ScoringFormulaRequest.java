package com.example.shose.server.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Setter
@Getter
@ToString
public class ScoringFormulaRequest {

    private BigDecimal exchangeRatePoin;

    private BigDecimal exchangeRateMoney;

}
