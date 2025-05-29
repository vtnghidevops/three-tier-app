package com.example.shose.server.dto.response.productdetail;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

/**
 * @author thangdt
 */
public interface ProductDetailResponse {
    @Value("#{target.id}")
    String getId();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.codeProduct}")
    String getCodeProduct();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.value}")
    String getValue();

    @Value("#{target.nameSole}")
    String getNameSole();

    @Value("#{target.nameCategory}")
    String getNameCategory();

    @Value("#{target.nameMaterial}")
    String getNameMaterial();

    @Value("#{target.nameBrand}")
    String getNameBrand();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.created_date}")
    Long getCreateDate();


    @Value("#{target.gender}")
    String getGender();

    @Value("#{target.status}")
    String getStatus();
    @Value("#{target.idPromotion}")
    String getIdPromotion();
}
