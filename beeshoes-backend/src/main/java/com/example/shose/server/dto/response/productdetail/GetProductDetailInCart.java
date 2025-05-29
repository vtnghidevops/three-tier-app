package com.example.shose.server.dto.response.productdetail;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface GetProductDetailInCart {
    @Value("#{target.idProductDetail}")
    String getIdProductDetail();

    @Value("#{target.price}")
    String getPrice();


}
