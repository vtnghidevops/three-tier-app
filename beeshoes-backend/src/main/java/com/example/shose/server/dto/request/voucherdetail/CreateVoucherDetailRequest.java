package com.example.shose.server.dto.request.voucherdetail;

import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */

@Getter
@Setter
public class CreateVoucherDetailRequest {

    private String idVoucher;

    private String beforPrice;

    private String afterPrice;

    private String discountPrice;


}
