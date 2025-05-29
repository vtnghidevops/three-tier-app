package com.example.shose.server.dto.response.promotion;

import com.example.shose.server.entity.Product;
import com.example.shose.server.entity.ProductDetail;
import com.example.shose.server.entity.Promotion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.util.List;

/*
 *  @author diemdz
 */
@Projection(types = Promotion.class)
public interface PromotionByIdRespone {
    @Value("#{target.id}")
    String getId();
    @Value("#{target.code}")
    String getCode();
    @Value("#{target.name}")
    String getName();
    @Value("#{target.value}")
    BigDecimal getValue();
    @Value("#{target.startDate}")
    Long getStartDate();
    @Value("#{target.endDate}")
    Long getEndDate();
    @Value("#{target.status}")
    String getStatus();
    @Value("#{target.productDetail}")
    String getProductDetail();
    @Value("#{target.productDetailUpdate}")
    String getProductDetailUpdate();
    @Value("#{target.product}")
    String getProduct();
    @Value("#{target.promotionProductDetail}")
    String getPromotionProductDetail();



}
