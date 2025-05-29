package com.example.shose.server.infrastructure.constant;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

@Data
@AllArgsConstructor
public abstract class VnPayConstant {

    public static String vnp_Version = "2.1.0";
    public static String vnp_Command = "2.1.0";
    public static String vnp_TmnCode = "11CG57AD";

    public static String vnp_HashSecret = "OOVYIJVYUBGEZMREEZTJRFKHSLGVTJSE";

    public static String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_Refound ="https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    public static String vnp_BankCode = "";
    public static String vnp_CurrCode = "VND";
//    public static String vnp_IpAddr = "0:0:0:0:0:0:0:1";
    public static String vnp_Locale = "vn";
    public static String vnp_ReturnUrl = System.getenv("CLIENT_DOMAIN") + "/payment/payment-success";
    //public static String vnp_ReturnUrl = "http://beeshoes.devopsedu.vn/payment/payment-success";
    public static String vnp_ReturnUrlBuyOnline = System.getenv("CLIENT_DOMAIN") + "/client/payment/payment-success";

//    public static String vnp_ExpireDate = "";




    //vpn_Ammount = tien *100;
    //vpn_OrderInfo = Mo ta;
    //public static String vnp_OrderType = "200000";
    //vnp_TxnRef ma tham chieu giao dich (unique);
}
