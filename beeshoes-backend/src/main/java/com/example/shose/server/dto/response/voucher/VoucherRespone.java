package com.example.shose.server.dto.response.voucher;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.response.base.BaseResponse;
import com.example.shose.server.entity.Voucher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = Voucher.class)
public interface VoucherRespone extends BaseResponse {

    @Value("#{target.id}")
    String getId();
    @Value("#{target.code}")
    String getCode();

    @Value("#{target.name}")
    String getName();
    @Value("#{target.value}")
    BigDecimal getValue();
    @Value("#{target.minimumBill}")
    Integer getMinimumBill();
    @Value("#{target.quantity}")
    Integer getQuantity();

    @Value("#{target.startDate}")
    Long getStartDate();
    @Value("#{target.endDate}")
    Long getEndDate();
    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.createdDate}")
    Long getCreateDate();




}
