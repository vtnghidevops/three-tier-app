package com.example.shose.server.service.impl;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.response.cart.AddToCart;
import com.example.shose.server.dto.response.cart.ListCart;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.Cart;
import com.example.shose.server.entity.CartDetail;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.AccountRepository;
import com.example.shose.server.repository.CartDetailRepository;
import com.example.shose.server.repository.CartRepository;
import com.example.shose.server.repository.ProductDetailRepository;
import com.example.shose.server.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Override
    public Cart addToCart(AddToCart listAddToCart) {

        Cart cart = cartRepository.getCartByAccount_Id(listAddToCart.getIdAccount());
        if (cart == null) {
            Cart c = new Cart();
            c.setAccount(accountRepository.findById(listAddToCart.getIdAccount()).get());
            cartRepository.save(c);


                CartDetail cartDetail = CartDetail.builder().productDetail(productDetailRepository.findById(listAddToCart.getIdProductDetail()).get())
                        .cart(c)
                        .price(listAddToCart.getPrice())
                        .quantity(listAddToCart.getQuantity())
                        .status(Status.DANG_SU_DUNG).build();

                cartDetailRepository.save(cartDetail);

        } else {
            List<CartDetail> listCartDetailOld = cartDetailRepository.getCartDetailByCart_Id(cart.getId());

            if (!listCartDetailOld.isEmpty()) {
                    boolean foundInOld = false;
                    for (CartDetail cartDetailOld : listCartDetailOld) {
                        System.out.println(cartDetailOld.getProductDetail().getId());
                        if (cartDetailOld.getProductDetail().getId().contains(listAddToCart.getIdProductDetail())) {
                            CartDetail cartDetail = cartDetailRepository.findById(cartDetailOld.getId()).get();
                            cartDetail.setQuantity(cartDetail.getQuantity() + listAddToCart.getQuantity());
                            cartDetailRepository.save(cartDetail);
                            foundInOld = true;
                            break;
                        }
                    }
                    if (!foundInOld) {
                        CartDetail cartDetail = CartDetail.builder().productDetail(productDetailRepository.findById(listAddToCart.getIdProductDetail()).get())
                                .cart(cart)
                                .price(listAddToCart.getPrice())
                                .quantity(listAddToCart.getQuantity())
                                .status(Status.DANG_SU_DUNG).build();

                        cartDetailRepository.save(cartDetail);
                    }

            } else {

                    CartDetail cartDetail = CartDetail.builder().productDetail(productDetailRepository.findById(listAddToCart.getIdProductDetail()).get()).cart(cart).price(listAddToCart.getPrice()).quantity(listAddToCart.getQuantity()).status(Status.DANG_SU_DUNG).build();
                    cartDetailRepository.save(cartDetail);

            }
        }
        return cart;
    }

    @Override
    public List<ListCart> getListCart(String idAccount) {
        Optional<Account> optional = accountRepository.findById(idAccount);
        if(optional.isEmpty()){
            throw new RestApiException("Tài khoản không tồn tại");
        }
        return cartRepository.getListCart(idAccount);
    }

    @Override
    public Integer quantityInCart(String idACcount) {
        return cartRepository.quantityInCart(idACcount);
    }




}
