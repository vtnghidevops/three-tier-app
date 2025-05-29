package com.example.shose.server.service;
/*
 *  @author diemdz
 */

import com.example.shose.server.entity.PromotionProductDetail;

public interface PromotionProductDetailService {
    PromotionProductDetail getByProductDetailAndPromotion(String idProductDetail, String idPromotion);
}
