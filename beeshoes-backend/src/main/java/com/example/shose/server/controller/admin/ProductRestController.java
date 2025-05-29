package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.product.CreateProductRequest;
import com.example.shose.server.dto.request.product.FindProductRequest;
import com.example.shose.server.dto.request.product.FindProductUseRequest;
import com.example.shose.server.dto.request.product.UpdateProductRequest;
import com.example.shose.server.dto.request.productdetail.FindProductDetailRequest;
import com.example.shose.server.service.ProductService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Nguyễn Vinh
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/product")
public class ProductRestController {

    @Autowired
    private ProductService productService;


    @GetMapping()
    public ResponseObject view(@ModelAttribute final FindProductRequest req) {
        return new ResponseObject(productService.findAll(req));
    }

    @GetMapping("/getByName")
    public ResponseObject viewAllByName(String name) {
        return new ResponseObject(productService.fillAllByName(name));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(productService.getOneById(id));
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateProductRequest req) {
        return new ResponseObject(productService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestBody UpdateProductRequest req) {
        req.setId(id);
        return new ResponseObject(productService.update(req));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(productService.delete(id));
    }

    @GetMapping("/use")
    public ResponseObject getProductUse(@ModelAttribute final FindProductUseRequest request){
        return  new ResponseObject(productService.getProductUse(request));
    }

    @GetMapping("/all-product")
    public ResponseObject getAllProductDetail(FindProductDetailRequest req){
        return  new ResponseObject(productService.getAllProduct(req));
    }
}
