package com.example.shose.server.dto.request.billdetail;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
public class RefundProductRequest {

    @NotEmpty
    private String id;

    @NotEmpty
    private String idBill;

    @NotEmpty
    private String idProduct;

    @NotNull
    private Integer size;

    @NotNull
    private Integer quantity;

    @NotEmpty
    private String totalMoney;

    @NotEmpty
    private String note;

}
