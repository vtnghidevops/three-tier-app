package com.example.shose.server.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ProductDetailDTOResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.description}")
    String getDescription();

    @Value("#{target.idBrand}")
    String getIdBrand();

    @Value("#{target.idSole}")
    String getIdSole();

    @Value("#{target.idCategory}")
    String getIdCategory();

    @Value("#{target.idMaterial}")
    String getIdMaterial();

    @Value("#{target.idCode}")
    String getIdCode();

    @Value("#{target.gender}")
    String getGender();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.quantity}")
    Integer getQuantity();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.idsize}")
    String getIdSize();

    @Value("#{target.QRCode}")
    String getQRCode();

    @Value("#{target.promotion}")
    Double getPromotion();

    @Value("#{target.productGiveBack}")
    Integer getProductGiveBack();

}
