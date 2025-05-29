package com.example.shose.server.dto.response.historypoin;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

/**
 * @author thangdt
 */
public interface HistoryPoinResponse {

    @Value("#{target.code}")
    String getCode();

    @Value("#{target.created_date}")
    Long getCreateDate();

    @Value("#{target.value}")
    int getValue();

    @Value("#{target.type_poin}")
    String getTyePoin();

    @Value("#{target.exchange_rate_money}")
    BigDecimal getExchangeRateMoney();

    @Value("#{target.exchange_rate_poin}")
    BigDecimal getExchangeRatePoin();

    @Value("#{target.total_money}")
    BigDecimal getTotalMoney();
}
