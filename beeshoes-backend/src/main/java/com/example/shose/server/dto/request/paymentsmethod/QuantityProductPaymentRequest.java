package com.example.shose.server.dto.request.paymentsmethod;

import com.example.shose.server.dto.request.bill.billcustomer.BillDetailOnline;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author thangdt
 */
@Getter
@Setter
public class QuantityProductPaymentRequest {
    List<BillDetailOnline> billDetail;
}
