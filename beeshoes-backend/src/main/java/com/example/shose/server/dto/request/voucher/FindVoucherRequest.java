package com.example.shose.server.dto.request.voucher;
/*
 *  @author diemdz
 */

import com.example.shose.server.infrastructure.common.PageableRequest;
import com.example.shose.server.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
@Getter
@Setter
public class FindVoucherRequest extends PageableRequest {

    private String code;

    private String name;

    private BigDecimal value;

    private Integer quantity;

    private String status;
    private Long startDate;
    private Long endDate;
}
