package com.example.shose.server.dto.response;

import com.example.shose.server.entity.ProductDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

/**
 * @author Nguyễn Vinh
 */

@Projection(types = {ProductDetail.class})
public interface ProductDetailReponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.created_date}")
    Long getCreateDate();

    @Value("#{target.gender}")
    String getGender();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.quantity}")
    Integer getQuantity();

    @Value("#{target.color}")
    String getColor();

    @Value("#{target.nameSize}")
    String getNameSize();

    @Value("#{target.nameCategory}")
    String getNameCategory();

    @Value("#{target.nameBrand}")
    String getNameBrand();

    @Value("#{target.size}")
    String getSize();

    @Value("#{target.promotion}")
    Integer getPromotion();

    @Value("#{target.QRCode}")
    String getQRCode();
}
