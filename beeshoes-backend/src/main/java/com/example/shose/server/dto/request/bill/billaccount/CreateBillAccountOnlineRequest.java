package com.example.shose.server.dto.request.bill.billaccount;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.request.bill.billcustomer.BillDetailOnline;
import com.example.shose.server.dto.response.payment.PayMentVnpayResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateBillAccountOnlineRequest {

    private String userName;
    private String phoneNumber;
    private String address;
    private BigDecimal moneyShip;
    private BigDecimal itemDiscount;
    private BigDecimal totalMoney;
    private String paymentMethod;
    private List<BillDetailOnline> billDetail;
    private BigDecimal afterPrice;
    private int poin;
    private String shippingTime;
    private String idVoucher;
    private String idAccount;

    private PayMentVnpayResponse responsePayment;
}
