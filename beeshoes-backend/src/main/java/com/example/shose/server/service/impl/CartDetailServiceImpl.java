package com.example.shose.server.service.impl;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.response.cartdetail.ChangeQuantity;
import com.example.shose.server.dto.response.cartdetail.ChangeSizeInCart;
import com.example.shose.server.entity.CartDetail;
import com.example.shose.server.entity.ProductDetail;
import com.example.shose.server.repository.CartDetailRepository;
import com.example.shose.server.repository.ProductDetailRepository;
import com.example.shose.server.service.CartDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartDetailServiceImpl implements CartDetailService {
    @Autowired
    private CartDetailRepository cartDetailRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public String changeSizeCartDetail(ChangeSizeInCart changeSize) {
            CartDetail cartDetail = cartDetailRepository.findById(changeSize.getIdCartDetail()).get();
            ProductDetail productDetail = productDetailRepository.findById(changeSize.getIdProductDetail()).get();
            cartDetail.setQuantity(changeSize.getQuantity());
            cartDetail.setPrice(changeSize.getPrice());
            cartDetail.setProductDetail(productDetail);
            cartDetailRepository.save(cartDetail);

        return "ok";
    }
    @Override
    public Boolean deleteCartDetail(String id) {
        cartDetailRepository.deleteById(id);
        return true;
    }

    @Override
    public String changeQuantity(ChangeQuantity changeQuantity) {
        CartDetail cartDetail = cartDetailRepository.findById(changeQuantity.getIdCartDetail()).get();
        cartDetail.setQuantity(changeQuantity.getQuantity());
        cartDetailRepository.save(cartDetail);
        return "ok";
    }

    @Override
    public void deleteAllCart(String idAccount) {
         cartDetailRepository.deleteAllCart(idAccount);
    }
}
