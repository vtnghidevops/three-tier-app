package com.example.shose.server.dto.request.product;

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * @author Nguyễn Vinh
 */
@Setter
@Getter
public class FindProductRequest extends PageableRequest {

    private String keyword;

    private String status;

    private int minQuantity;

    private  int maxQuantity;
}
