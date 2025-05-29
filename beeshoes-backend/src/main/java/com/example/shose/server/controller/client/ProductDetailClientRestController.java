package com.example.shose.server.controller.client;

import com.example.shose.server.dto.request.productdetail.FindProductDetailByCategorysRequest;
import com.example.shose.server.infrastructure.common.PageableObject;
import com.example.shose.server.infrastructure.common.PageableRequest;
import com.example.shose.server.service.ProductDetailService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/product-detail")
public class ProductDetailClientRestController {

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping("/byCategory/{id}")
    public ResponseObject getByIdCategory(@PathVariable("id") String id) {
        return new ResponseObject(productDetailService.GetProductDetailByCategory(id));
    }
    @GetMapping("/have-promotion")
    public ResponseObject getProductDetailHavePromotion(Pageable pageable) {
        return new ResponseObject(productDetailService.getProductDetailHavePromotion(pageable));
    }
    @GetMapping("/new")
    public ResponseObject getProductDetailNew(Pageable pageable) {
        return new ResponseObject(productDetailService.getProductDetailNew(pageable));
    }
    @GetMapping("/sell-many")
    public ResponseObject getProductDetailSellMany(Pageable pageable) {
        return new ResponseObject(productDetailService.getProductDetailSellMany(pageable));
    }


    @GetMapping("/{id}")
    public ResponseObject getDetailProductOfClient(@PathVariable("id") String id) {
        return new ResponseObject(productDetailService.getDetailProductOfClient(id));
    }

    @GetMapping("/listSizeCart/{id}&&{codeColor}")
    public ResponseObject getListSizeInCart(@PathVariable("id") String id, @PathVariable("codeColor") String codeColor) {
        String rawCodeColor = codeColor.replace("%23", "#");

        return new ResponseObject(productDetailService.listSizeByProductAndColor(id, rawCodeColor));
    }
    @GetMapping("/list")
    public ResponseObject getProductDetailByCategorys(FindProductDetailByCategorysRequest request,Pageable pageable) {
        return new ResponseObject(productDetailService.getProductDetailByCategorys(request,pageable));
    }

}
