package com.example.shose.server.dto;

import com.example.shose.server.entity.ProductDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductDetailDTO {

    private String id;

    private String productId;

    private String description;

    private String gender;

    private BigDecimal price;

    private String status;

    private String categoryId;

    private String materialId;

    private String soleId;

    private String brandId;

    public ProductDetailDTO(ProductDetail detail) {
        this.id = detail.getId();
        this.brandId = detail.getBrand().getId();
        this.productId = detail.getProduct().getName();
        this.categoryId = detail.getCategory().getId();
        this.description = detail.getDescription();
        this.gender = detail.getGender().name();
        this.materialId = detail.getMaterial().getId();
        this.price = detail.getPrice();
        this.soleId = detail.getSole().getId();
        this.status = detail.getStatus().name();
    }
}
