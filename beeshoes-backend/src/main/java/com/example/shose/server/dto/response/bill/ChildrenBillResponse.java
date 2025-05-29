package com.example.shose.server.dto.response.bill;

import com.example.shose.server.dto.response.billdetail.BillDetailResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * @author thangdt
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildrenBillResponse {

    private String stt;

    private String id;

    private String codeProduct;

    private String productName;

    private String nameColor;

    private String nameSize;

    private String nameSole;

    private String nameMaterial;

    private String nameCategory;

    private BigDecimal price;

    private Integer quantity;

    private Integer quantityProductDetail;

    public ChildrenBillResponse(BillDetailResponse response) {
        this.stt = response.getStt();
        this.id = response.getId();
        this.codeProduct = response.getCodeProduct();
        this.productName = response.getNameCategory();
        this.nameColor = response.getNameColor();
        this.nameSize = response.getNameSize();
        this.nameSole = response.getNameSole();
        this.nameMaterial = response.getNameMaterial();
        this.nameCategory = response.getNameCategory();
        this.price = response.getPrice();
        this.quantity = response.getQuantity();
//        this.quantityProductDetail = response.getQuantityProductDetail();
    }
}
