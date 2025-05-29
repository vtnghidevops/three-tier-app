package com.example.shose.server.dto.response.productdetail;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.List;

public interface GetDetailProductOfClient {

    @Value("#{target.idProductDetail}")
    String getIdProductDetail();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.quantity}")
    Integer getQuantity();
    @Value("#{target.valuePromotion}")
    BigDecimal getValuePromotion();
    @Value("#{target.createdDate}")
    String getCreatedDate();

    @Value("#{target.codeColor}")
    String getCodeColor();

    @Value("#{target.nameSize}")
    String getNameSize();
    @Value("#{target.listSize}")
    String getListSize();

    @Value("#{target.nameCategory}")
    String getNameCategory();
    @Value("#{target.nameBrand}")
    String getNameBrand();
    @Value("#{target.nameMaterial}")
    String getNameMaterial();
    @Value("#{target.nameSole}")
    String getNameSole();

}
