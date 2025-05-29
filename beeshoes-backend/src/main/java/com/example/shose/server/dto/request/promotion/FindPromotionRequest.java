package com.example.shose.server.dto.request.promotion;
/*
 *  @author diemdz
 */

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FindPromotionRequest extends PageableRequest {

    private String code;

    private String name;

    private BigDecimal value;
    private String status;
    private Long startDate;
    private Long endDate;
}
