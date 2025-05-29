package com.example.shose.server.dto.response.payment;

import lombok.Getter;
import lombok.Setter;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * @author thangdt
 */
@Getter
@Setter
public class PayMentVnpayResponse {
    private String vnp_Amount;
    private String vnp_BankCode;
    private String vnp_BankTranNo;
    private String vnp_CardType;
    private String vnp_OrderInfo;
    private String vnp_PayDate;
    private String vnp_ResponseCode;
    private String vnp_TmnCode;
    private String vnp_TransactionNo;
    private String vnp_TransactionStatus;
    private String vnp_TxnRef;
    private String vnp_SecureHash;

    public String toParamsString() {
        return "vnp_Amount=" + setParam(vnp_Amount) +
                "&vnp_BankCode=" + setParam(vnp_BankCode) +
                "&vnp_BankTranNo=" + setParam(vnp_BankTranNo) +
                "&vnp_CardType=" + setParam(vnp_CardType) +
                "&vnp_OrderInfo=" + setParam(vnp_OrderInfo) +
                "&vnp_PayDate=" + setParam(vnp_PayDate) +
                "&vnp_ResponseCode=" + setParam(vnp_ResponseCode) +
                "&vnp_TmnCode=" + setParam(vnp_TmnCode) +
                "&vnp_TransactionNo=" + setParam(vnp_TransactionNo) +
                "&vnp_TransactionStatus=" + setParam(vnp_TransactionStatus) +
                "&vnp_TxnRef=" + setParam(vnp_TxnRef);
    }

    public String setParam(String param){
        try {
            return URLEncoder.encode(param, StandardCharsets.US_ASCII.toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
