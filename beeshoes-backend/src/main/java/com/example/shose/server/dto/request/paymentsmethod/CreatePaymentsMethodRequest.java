package com.example.shose.server.dto.request.paymentsmethod;

import com.example.shose.server.infrastructure.constant.StatusMethod;
import com.example.shose.server.infrastructure.constant.StatusPayMents;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * @author thangdt
 */
@Getter
@Setter
public class CreatePaymentsMethodRequest {

    private String actionDescription;

    private BigDecimal totalMoney;

    private StatusMethod method;

    private StatusPayMents status;

    private String transaction;

}
