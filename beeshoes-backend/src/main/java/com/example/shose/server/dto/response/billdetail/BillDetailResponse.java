package com.example.shose.server.dto.response.billdetail;

import com.example.shose.server.entity.Bill;
import com.example.shose.server.entity.BillDetail;
import com.example.shose.server.entity.Product;
import com.example.shose.server.entity.ProductDetail;
import com.example.shose.server.entity.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

/**
 * @author thangdt
 */
@Projection(types = {Bill.class, BillDetail.class, ProductDetail.class, Product.class, Size.class})
public interface BillDetailResponse {

    @Value("#{target.stt}")
    String getStt();

    @Value("#{target.id_product}")
    String getIdProduct();

    @Value("#{target.id_bill}")
    String getIdBill();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.code_product}")
    String getCodeProduct();

    @Value("#{target.product_name}")
    String getProductName();

    @Value("#{target.name_color}")
    String getNameColor();

    @Value("#{target.name_size}")
    String getNameSize();

    @Value("#{target.name_sole}")
    String getNameSole();

    @Value("#{target.name_material}")
    String getNameMaterial();

    @Value("#{target.name_category}")
    String getNameCategory();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.quantity}")
    Integer getQuantity();

    @Value("#{target.max_quantity}")
    Integer getMaxQuantity();

    @Value("#{target.promotion}")
    Integer getPromotion();

    @Value("#{target.status_bill}")
    String getStatus();

    @Value("#{target.codeColor}")
    String getCodeColor();
}
