package com.example.shose.server.dto.request.bill.billcustomer;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.response.payment.PayMentVnpayResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateBillCustomerOnlineRequest {
    private String userName;
    private String phoneNumber;
    private String email;
    private String address;
    private String ward;
    private String wardCode;

    private String district;
    private Integer districtId;

    private String shippingTime;

    private String province;
    private Integer provinceId;

    private BigDecimal moneyShip;
    private BigDecimal itemDiscount;

    private BigDecimal totalMoney;
    private String paymentMethod;

    private List<BillDetailOnline> billDetail;

    private BigDecimal afterPrice;

    private String idVoucher;

    private PayMentVnpayResponse responsePayment;
}
