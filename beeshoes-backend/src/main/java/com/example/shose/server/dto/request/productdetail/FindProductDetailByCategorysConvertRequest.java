package com.example.shose.server.dto.request.productdetail;
/*
 *  @author diemdz
 */

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
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class FindProductDetailByCategorysConvertRequest {
    private List<String> colors;
    private List<String> brands;
    private List<String> materials;
    private List<String> nameSizes;
    private List<String> soles;
    private List<String> categorys;
    private String gender;
    private List<String> statuss;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String sellOff;
    private String newProduct;

}
