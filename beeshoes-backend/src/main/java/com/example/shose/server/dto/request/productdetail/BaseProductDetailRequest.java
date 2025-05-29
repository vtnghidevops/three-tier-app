package com.example.shose.server.dto.request.productdetail;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Nguyễn Vinh
 */
@Setter
@Getter
@ToString
public abstract class BaseProductDetailRequest {

    @NotBlank
    private String description;

    @NotBlank
    private String gender;

    @NotBlank
    private String price;

    @NotBlank
    private String status;

    @NotBlank
    private String categoryId;

    @NotBlank
    private String productId;

    @NotBlank
    private String color;

    @NotNull
    private int size;

    @NotBlank
    private String materialId;

    @NotBlank
    private String soleId;

    @NotBlank
    private String brandId;

    @NotNull
    private int quantity;

}
