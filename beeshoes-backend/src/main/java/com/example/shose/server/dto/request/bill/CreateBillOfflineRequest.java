package com.example.shose.server.dto.request.bill;

import com.example.shose.server.dto.request.billdetail.CreateBillDetailRequest;
import com.example.shose.server.dto.request.paymentsmethod.CreatePaymentsMethodRequest;
import com.example.shose.server.dto.request.voucherdetail.CreateVoucherDetailRequest;
import com.example.shose.server.infrastructure.constant.StatusBill;
import com.example.shose.server.infrastructure.constant.StatusMethod;
import com.example.shose.server.infrastructure.constant.StatusPayMents;
import com.example.shose.server.infrastructure.constant.TypeBill;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author thangdt
 */
@Getter
@Setter
public class CreateBillOfflineRequest {

    private String phoneNumber;

    private String idUser;

    private String address;

    private String userName;

    @NotEmpty
    private String itemDiscount;

    @NotEmpty
    private String totalMoney;

    private String note;

    @NotEmpty
    private String typeBill;

    @NotEmpty
    private String code;

    private int poin;

    @NotEmpty
    private String statusPayMents;

    private String deliveryDate;

    private boolean openDelivery;

    private String moneyShip;

    private String email;

    private BigDecimal totalExcessMoney;

    @NotNull
    private List<CreateBillDetailRequest> billDetailRequests;

    @NotNull
    private List<CreatePaymentsMethodRequest> paymentsMethodRequests;

    @NotNull
    private List<CreateVoucherDetailRequest> vouchers;

}
