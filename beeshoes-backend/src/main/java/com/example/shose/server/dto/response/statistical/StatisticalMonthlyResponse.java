package com.example.shose.server.dto.response.statistical;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author Hào Ngô
 */
public interface StatisticalMonthlyResponse {
    @Value("#{target.totalBill}")
    Integer getTotalBill();

    @Value("#{target.totalBillAmount}")
    Integer getTotalBillAmount();

    @Value("#{target.totalProduct}")
    Integer getTotalProduct();
}
