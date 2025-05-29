package com.example.shose.server.dto.request.voucher;
/*
 *  @author diemdz
 */

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;


@Getter
@Setter
public abstract class BaseVoucherRequest {

    @NotBlank(message = "Nhập tên khuyến mãi")
    private String name;
    @NotNull(message = "Nhập giá trị khuyến mãi")
    private BigDecimal value;
    @NotNull(message = "Nhập số lượng khuyến mãi")
    private Integer quantity;
    @NotNull(message = "Nhập ngày bắt đầu khuyến mãi")
    private Long startDate;
    @NotNull(message = "Nhập ngày kết thúc khuyến mãi")
    private Long endDate;
    private Integer minimumBill;
}
