package com.example.shose.server.dto.response.promotion;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface GetPromotionOfProductDetail {
    @Value("#{target.valuePromotion}")
    BigDecimal getValuePromotion();
}
