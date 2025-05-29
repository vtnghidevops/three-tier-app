package com.example.shose.server.dto.request.bill;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class BillShipRequest {

    private BigDecimal ship ;

    private String idBill;
}
