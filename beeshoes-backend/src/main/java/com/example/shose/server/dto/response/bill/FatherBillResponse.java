package com.example.shose.server.dto.response.bill;

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
public class FatherBillResponse {

    private String code;

    private String id;

    private long createdDate;

    private String userName;

    private String nameEmployees;

    private int type;

    private String statusBill;

    private BigDecimal totalMoney;

    private BigDecimal itemDiscount;

    public FatherBillResponse(BillResponse billResponse) {
        this.code = billResponse.getCode();
        this.id = billResponse.getId();
        this.createdDate = billResponse.getCreatedDate();
        this.userName = billResponse.getUserName();
        this.nameEmployees = billResponse.getNameEmployees();
//        this.type = billResponse.getType();
        this.statusBill = billResponse.getStatusBill();
        this.totalMoney = billResponse.getTotalMoney();
        this.itemDiscount = billResponse.getItemDiscount();
    }
}
