package com.example.shose.server.dto.response.bill;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.request.bill.billcustomer.BillDetailOnline;
import com.example.shose.server.entity.BillDetail;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.List;

public interface BillAccountResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.totalMoney}")
    BigDecimal getTotalMoney();

    @Value("#{target.statusBill}")
    String getStatusBill();
    @Value("#{target.billDetail}")
     String getBillDetail();

}
