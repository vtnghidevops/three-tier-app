package com.example.shose.server.dto.request.promotion;
/*
 *  @author diemdz
 */

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;


@Getter
@Setter
@ToString
public abstract class BasePromotionRequest {
    @NotBlank(message = "Nhập tên khuyến mại")
    private String name;
    @NotNull(message = "Nhập giá trị khuyến mại")
    private BigDecimal value;
    @NotNull(message = "Nhập ngày bắt đầu khuyến mại")
    private Long startDate;
    @NotNull(message = "Nhập ngày kết thúc khuyến mại")
    private Long endDate;
//    private Status status;
}
