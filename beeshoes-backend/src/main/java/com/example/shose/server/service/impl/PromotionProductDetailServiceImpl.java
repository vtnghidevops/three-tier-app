package com.example.shose.server.service.impl;

import com.example.shose.server.entity.PromotionProductDetail;
import com.example.shose.server.repository.PromotionProductDetailRepository;
import com.example.shose.server.service.PromotionProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/*
 *  @author diemdz
 */
@Service
public class PromotionProductDetailServiceImpl implements PromotionProductDetailService {
    @Autowired
    private PromotionProductDetailRepository promotionProductDetailRepository;
    @Override
    public PromotionProductDetail getByProductDetailAndPromotion(String idProductDetail, String idPromotion) {
        return promotionProductDetailRepository.getByProductDetailAndPromotion(idProductDetail,idPromotion);
    }
}
