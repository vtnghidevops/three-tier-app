package com.example.shose.server.dto.request.productdetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpdateQuantityAndPrice {

    private String id;

    private BigDecimal price;

    private int quantity;
}
