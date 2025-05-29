package com.example.shose.server.dto.request.billgiveback;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBillGiveBack {

    private String idBill;

    private String idAccount;

    private String note;

    private BigDecimal totalBillGiveBack;

    private String idVoucher;
}
