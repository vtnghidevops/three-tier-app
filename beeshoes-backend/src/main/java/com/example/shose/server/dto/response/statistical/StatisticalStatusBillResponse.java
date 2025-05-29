package com.example.shose.server.dto.response.statistical;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author Hào Ngô
 */
public interface StatisticalStatusBillResponse {
    @Value("#{target.statusBill}")
    String getStatusBill();
    @Value("#{target.totalStatusBill}")
    Integer getTotalStatusBill();
}
