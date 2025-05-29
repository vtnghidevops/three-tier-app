package com.example.shose.server.dto.response;

import com.example.shose.server.entity.ProductDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

/**
 * @author thangdt
 */
@Projection(types = {ProductDetail.class})
public interface CustomProductRespone {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.totalQuantity}")
    Integer getQuantity();

    @Value("#{target.avg_promotion_value}")
    Integer getPromotion();

}
