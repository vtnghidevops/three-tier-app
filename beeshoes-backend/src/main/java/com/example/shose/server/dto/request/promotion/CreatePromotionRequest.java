package com.example.shose.server.dto.request.promotion;

import com.example.shose.server.dto.request.productdetail.IdProductDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/*
 *  @author diemdz
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromotionRequest extends BasePromotionRequest {
    private List<IdProductDetail> idProductDetails =new ArrayList<>();
}
