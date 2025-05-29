package com.example.shose.server.dto.request.productdetail;
/*
 *  @author diemdz
 */

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FindProductDetailByCategorysRequest  {
    private String color;
    private String brand;
    private String material;
    private String nameSize;
    private String sole;
    private String category;
    private String gender;
    private String status;
    private BigDecimal minPrice;
    private  BigDecimal maxPrice;
    private String sellOff;
    private String newProduct;
}
