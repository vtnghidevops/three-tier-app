package com.example.shose.server.dto.response.statistical;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author Hào Ngô
 */
public interface StatisticalBillDateResponse {
    @Value("#{target.billDate}")
    Long getBillDate();

    @Value("#{target.totalBillDate}")
    Integer getTotalBillDate();
}
