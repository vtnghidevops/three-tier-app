package com.example.shose.server.controller.client;

import com.example.shose.server.dto.response.cartdetail.ChangeQuantity;
import com.example.shose.server.dto.response.cartdetail.ChangeSizeInCart;
import com.example.shose.server.service.CartDetailService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/cart-detail")
public class CartDetailClientRestCotroller {
    @Autowired
    private CartDetailService cartDetailService;
    @PostMapping("/change-size")
    public ResponseObject changSize(@RequestBody ChangeSizeInCart changeSize) {
        return new ResponseObject(cartDetailService.changeSizeCartDetail(changeSize));
    }
    @DeleteMapping("/{id}")
    public ResponseObject deleteCartDetail(@PathVariable("id") String idCartDetail) {
        return new ResponseObject(cartDetailService.deleteCartDetail(idCartDetail));
    }
    @PostMapping("/change-quantity")
    public ResponseObject changeQuantity(@RequestBody ChangeQuantity changeQuantity) {
        return new ResponseObject(cartDetailService.changeQuantity(changeQuantity));
    }
    @DeleteMapping("/deleteAll/{idAccount}")
    public void deleteAllCart(@PathVariable("idAccount") String idAccount) {
        cartDetailService.deleteAllCart(idAccount);
    }
}
