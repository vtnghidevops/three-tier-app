package com.example.shose.server.dto.response.bill;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author thangdt
 */
public interface ListStatusRespone {

    @Value("#{target.status_bill}")
    String getStatus();

    @Value("#{target.quantity}")
    String getQuantity();

}
