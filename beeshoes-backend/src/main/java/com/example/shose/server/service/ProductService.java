package com.example.shose.server.service;

import com.example.shose.server.dto.request.product.CreateProductRequest;
import com.example.shose.server.dto.request.product.FindProductRequest;
import com.example.shose.server.dto.request.product.FindProductUseRequest;
import com.example.shose.server.dto.request.product.UpdateProductRequest;
import com.example.shose.server.dto.request.productdetail.FindProductDetailRequest;
import com.example.shose.server.dto.response.CustomProductRespone;
import com.example.shose.server.dto.response.ProductDetailReponse;
import com.example.shose.server.dto.response.ProductResponse;
import com.example.shose.server.dto.response.product.ProductUseRespone;
import com.example.shose.server.entity.Product;
import jakarta.validation.Valid;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
public interface ProductService {

    List<ProductResponse> findAll(final FindProductRequest req);

    List<String> fillAllByName(String name);

    Product create(@Valid final CreateProductRequest req);

    Product update(@Valid final UpdateProductRequest req);

    Boolean delete(String id);

    Product getOneById(String id);

    List<ProductUseRespone> getProductUse(FindProductUseRequest request);

    List<ProductDetailReponse> getAllProduct(FindProductDetailRequest req);
}
