package com.example.shose.server.dto.response.statistical;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author Hào Ngô
 */
public interface StatisticalProductDateResponse {
    @Value("#{target.billDate}")
    Long getBillDate();

    @Value("#{target.totalProductDate}")
    Integer getTotalProductDate();
}
