package com.example.shose.server.dto.response.statistical;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

/**
 * @author Hào Ngô
 */
public interface StatisticalBestSellingProductResponse {
    @Value("#{target.image}")
    String getImage();
    @Value("#{target.nameProduct}")
    String getNameProduct();
    @Value("#{target.price}")
    BigDecimal getPrice();
    @Value("#{target.sold}")
    BigDecimal getSold();
    @Value("#{target.sales}")
    BigDecimal getSales();
}
