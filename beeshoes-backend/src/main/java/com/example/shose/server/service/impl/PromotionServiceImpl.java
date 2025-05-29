package com.example.shose.server.service.impl;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.request.productdetail.IdProductDetail;
import com.example.shose.server.dto.request.promotion.CreatePromotionRequest;
import com.example.shose.server.dto.request.promotion.FindPromotionRequest;
import com.example.shose.server.dto.request.promotion.UpdatePromotionRequest;
import com.example.shose.server.dto.response.promotion.GetPromotionOfProductDetail;
import com.example.shose.server.dto.response.promotion.PromotionByIdRespone;
import com.example.shose.server.dto.response.promotion.PromotionByProDuctDetail;
import com.example.shose.server.dto.response.promotion.PromotionRespone;
import com.example.shose.server.entity.ProductDetail;
import com.example.shose.server.entity.Promotion;
import com.example.shose.server.entity.PromotionProductDetail;
import com.example.shose.server.entity.Voucher;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusPromotion;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.ProductDetailRepository;
import com.example.shose.server.repository.PromotionProductDetailRepository;
import com.example.shose.server.repository.PromotionRepository;
import com.example.shose.server.service.PromotionService;
import com.example.shose.server.util.RandomNumberGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private PromotionProductDetailRepository promotionProductDetailRepository;

    public static void main(String[] args) {
        System.out.println(System.currentTimeMillis());

    }

    @Override
    public List<PromotionRespone> getAll(FindPromotionRequest findPromotionRequest) {
        return promotionRepository.getAllPromotion(findPromotionRequest);
    }

    @Override
    @Transactional
    public Promotion add(CreatePromotionRequest request) throws Exception {
        Optional<Promotion>  optionalPromotion = promotionRepository.findByName(request.getName());
        if(optionalPromotion.isPresent()){
            throw new RestApiException("Tên khuyến mại đã tồn tại");
        }
        if (ObjectUtils.isEmpty(request.getIdProductDetails())) {
            throw new RestApiException("Không có sản phẩm");
        }
        for (IdProductDetail x : request.getIdProductDetails()) {
            Optional<ProductDetail> optional = productDetailRepository.findById(x.getId());
            if (!optional.isPresent()) {
                throw new RestApiException("Có sản phẩm không tồn tại");
            }
        }
        if(request.getEndDate() <= request.getStartDate()){
            throw new RestApiException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }
        long currentSeconds = (System.currentTimeMillis() / 1000) * 1000;
        if(request.getEndDate() <=currentSeconds){
            throw new RestApiException("Ngày kết thúc phải lớn hơn hiện tại");
        }

        StatusPromotion status = getStatusPromotion(request.getStartDate(), request.getEndDate());
        Promotion promotion = Promotion.builder().code(new RandomNumberGenerator().randomToString("KM",900000000))
                .name(request.getName()).value(request.getValue())
                .startDate(request.getStartDate()).endDate(request.getEndDate())
                .status(status).build();
        promotionRepository.save(promotion);

        List<PromotionProductDetail> promotionProductDetails = new ArrayList<>();
        for (IdProductDetail x : request.getIdProductDetails()) {
            Optional<ProductDetail> optional = productDetailRepository.findById(x.getId());
            PromotionProductDetail promotionProductDetail = new PromotionProductDetail();
            promotionProductDetail.setPromotion(promotion);
            promotionProductDetail.setProductDetail(optional.get());
            promotionProductDetail.setStatus(Status.DANG_SU_DUNG);
            promotionProductDetails.add(promotionProductDetail);
        }
        promotionProductDetailRepository.saveAll(promotionProductDetails);
        return promotion;
    }

    @Override
    @Transactional
    public Promotion update(UpdatePromotionRequest request) {
        Optional<Promotion> optional = promotionRepository.findById(request.getId());
        if (!optional.isPresent()) {
            throw new RestApiException("Khuyến mại không tồn tại");
        }
        for (IdProductDetail x : request.getIdProductDetails()) {
            Optional<ProductDetail> optional1 = productDetailRepository.findById(x.getId());
            if (!optional1.isPresent()) {
                throw new RestApiException("Có sản phẩm không tồn tại");
            }
        }

        StatusPromotion status = getStatusPromotion(request.getStartDate(), request.getEndDate());
        Promotion promotion = optional.get();
        promotion.setName(request.getName());
        promotion.setValue(request.getValue());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setStatus(status);
        promotionRepository.save(promotion);

        // TODO check nếu status == HET_HAN_KICH_HOAT => các sản phẩm không được sử dụng khuyến mại này
        boolean checkStatus = updateProductDetailsStatus(promotion.getId(),promotion.getStatus());

        if(checkStatus == false) {
            PromotionByIdRespone promotionByIdRespone = promotionRepository.getByIdPromotion(request.getId());
            List<PromotionProductDetail> promotionProductDetails = new ArrayList<>();
            if (promotionByIdRespone.getProductDetailUpdate() == null) {
                for (IdProductDetail idProductDetailNew : request.getIdProductDetails()) {
                    PromotionProductDetail promotionProductDetail = new PromotionProductDetail();
                    promotionProductDetail.setPromotion(promotion);
                    promotionProductDetail.setProductDetail(productDetailRepository.findById(idProductDetailNew.getId()).get());
                    promotionProductDetail.setStatus(getStatus(status));
                    promotionProductDetails.add(promotionProductDetail);
                }
                promotionProductDetailRepository.saveAll(promotionProductDetails);
            } else {
                for (String idProductDetailOld : promotionByIdRespone.getProductDetailUpdate().split(",")) {
                    boolean foundInNew = false;
                    for (IdProductDetail idProductDetailNew : request.getIdProductDetails()) {
                        if (idProductDetailNew.getId().contains(idProductDetailOld)) {
                            foundInNew = true;
                            break;
                        }
                    }

                    if (!foundInNew) {
                        PromotionProductDetail promotionProductDetail = promotionProductDetailRepository.getByProductDetailAndPromotion(idProductDetailOld, promotionByIdRespone.getId());
                        promotionProductDetail.setStatus(Status.KHONG_SU_DUNG);
                        promotionProductDetailRepository.save(promotionProductDetail);
                    } else {
                        PromotionProductDetail promotionProductDetail = promotionProductDetailRepository.getByProductDetailAndPromotion(idProductDetailOld, promotionByIdRespone.getId());
                        promotionProductDetail.setStatus(Status.DANG_SU_DUNG);
                        promotionProductDetailRepository.save(promotionProductDetail);
                    }
                }

                for (IdProductDetail idProductDetailNew : request.getIdProductDetails()) {
                    boolean foundInOld = false;

                    for (String idProductDetailOld : promotionByIdRespone.getProductDetailUpdate().split(",")) {
                        if (idProductDetailOld.contains(idProductDetailNew.getId())) {
                            foundInOld = true;
                            break;
                        }
                    }

                    if (!foundInOld) {
                        PromotionProductDetail promotionProductDetail = new PromotionProductDetail();
                        promotionProductDetail.setPromotion(promotion);
                        promotionProductDetail.setProductDetail(productDetailRepository.findById(idProductDetailNew.getId()).get());
                        promotionProductDetail.setStatus(Status.DANG_SU_DUNG);
                        promotionProductDetailRepository.save(promotionProductDetail);
                    }
                }
            }
        }
        return promotion;
    }

    @Override
    public Promotion updateStatus(String id) {
        Optional<Promotion> optional = promotionRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException("Khuyến mại không tồn tại");
        }
        Promotion promotion = optional.get();
        StatusPromotion status = getStatusPromotion(promotion.getStartDate(), promotion.getEndDate());
        promotion.setStatus(status);
        promotionRepository.save(promotion);

        // TODO check nếu status == HET_HAN_KICH_HOAT => các sản phẩm không được sử dụng khuyến mại này
        updateProductDetailsStatus(promotion.getId(),promotion.getStatus());
        return promotion;
    }


    @Override
    public Promotion getById(String id) {
        Promotion promotion = promotionRepository.findById(id).get();
        return promotion;
    }

    @Override
    public List<Promotion> expiredVoucher() {
        List<Promotion> expiredPromotions = promotionRepository.findExpiredPromotions(System.currentTimeMillis());

        for (Promotion promotion : expiredPromotions) {
            promotion.setStatus(StatusPromotion.DANG_KICH_HOAT);
            promotionRepository.save(promotion);
        }
        return expiredPromotions;
    }

    @Override
    public List<Promotion> startVoucher() {
        List<Promotion> startPromotions = promotionRepository.findStartPromotions(System.currentTimeMillis());
        for (Promotion promotion : startPromotions) {
            promotion.setStatus(StatusPromotion.DANG_KICH_HOAT);
            promotionRepository.save(promotion);
        }
        return startPromotions;
    }

    @Override
    public PromotionByIdRespone getByIdPromotion(String id) {
        return promotionRepository.getByIdPromotion(id);
    }

    @Override
    public List<PromotionByProDuctDetail> getByIdProductDetail(String id) {
        return promotionRepository.getByIdProductDetail(id);
    }

    @Override
    public GetPromotionOfProductDetail getPromotionOfProductDetail(String id) {
        return promotionRepository.getPromotionOfProductDetail(id);
    }

    private Status getStatus(StatusPromotion status) {
        return status == StatusPromotion.DANG_KICH_HOAT || status ==  StatusPromotion.CHUA_KICH_HOAT ? Status.DANG_SU_DUNG : Status.KHONG_SU_DUNG;
    }

    private StatusPromotion getStatusPromotion(long startDate, long endDate) {
        long currentSeconds = (System.currentTimeMillis() / 1000) * 1000;
        return (startDate > currentSeconds) ? StatusPromotion.CHUA_KICH_HOAT : (currentSeconds >= endDate  ? StatusPromotion.HET_HAN_KICH_HOAT : StatusPromotion.DANG_KICH_HOAT);
    }

    private boolean updateProductDetailsStatus(String idPromotion, StatusPromotion status) {
        List<PromotionProductDetail> promotionProductDetailList = promotionProductDetailRepository.findAllByIdPromotion(idPromotion);
        if (status.equals(StatusPromotion.HET_HAN_KICH_HOAT)) {
            List<PromotionProductDetail> updatePromotionProductDetails = promotionProductDetailList.stream().map(promotionProductDetail -> {
                promotionProductDetail.setStatus(Status.KHONG_SU_DUNG);
                return promotionProductDetail;
            }).collect(Collectors.toList());
            promotionProductDetailRepository.saveAll(updatePromotionProductDetails);
            return true;
        }
        return false;
    }

}
