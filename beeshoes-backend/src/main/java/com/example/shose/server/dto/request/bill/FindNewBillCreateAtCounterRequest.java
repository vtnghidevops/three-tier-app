package com.example.shose.server.dto.request.bill;

import com.example.shose.server.util.ConvertDateToLong;
import lombok.Getter;
import lombok.Setter;

import java.util.Calendar;

/**
 * @author thangdt
 */
@Getter
@Setter
public class FindNewBillCreateAtCounterRequest {

    private Long startCreateBill = new ConvertDateToLong().getLongDateNow();

    private Long endCreateBill =  new ConvertDateToLong().getLongDateNow();

    private String key;

}
