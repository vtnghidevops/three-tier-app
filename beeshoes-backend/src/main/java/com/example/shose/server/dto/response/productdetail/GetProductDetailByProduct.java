package com.example.shose.server.dto.response.productdetail;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface GetProductDetailByProduct {
    @Value("#{target.id}")
    String getId();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.codeProduct}")
    String getCodeProduct();
    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.value}")
    BigDecimal getValue();
    @Value("#{target.created_date}")
    Long getCreateDate();


    @Value("#{target.gender}")
    String getGender();

    @Value("#{target.status}")
    String getStatus();
    @Value("#{target.codeColor}")
    String getCodeColor();
    @Value("#{target.nameSize}")
    String getNameSize();

}
