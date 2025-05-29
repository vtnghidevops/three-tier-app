package com.example.shose.server.controller.client;

import com.example.shose.server.dto.request.bill.billcustomer.BillDetailOnline;
import com.example.shose.server.dto.request.bill.billcustomer.CreateBillCustomerOnlineRequest;
import com.example.shose.server.dto.request.payMentMethod.CreatePayMentMethodTransferRequest;
import com.example.shose.server.dto.request.paymentsmethod.QuantityProductPaymentRequest;
import com.example.shose.server.dto.response.payment.PayMentVnpayResponse;
import com.example.shose.server.service.BillService;
import com.example.shose.server.service.PaymentsMethodService;
import com.example.shose.server.util.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.util.List;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/payment")
public class PaymentRestController {
    @Autowired
    private PaymentsMethodService paymentsMethodService;


    @PostMapping("/payment-vnpay")
    public ResponseObject pay(@RequestBody CreatePayMentMethodTransferRequest payModel, HttpServletRequest request){
        try {
            return new ResponseObject(paymentsMethodService.payWithVNPAYOnline(payModel, request)) ;
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/change-quantity-payment")
    public ResponseObject changeQuantityProductAfterPayment(@RequestBody QuantityProductPaymentRequest request){
        return new ResponseObject(paymentsMethodService.changeQuantityProduct( request)) ;
    }
    @PostMapping("/minusQuantityProductDetail")
    public ResponseObject minusQuantityProductDetail(@RequestBody List<BillDetailOnline> list){
        return new ResponseObject(paymentsMethodService.minusQuantityProductDetail(list)) ;
    }
    @PostMapping("/refundQuantityProductDetail")
    public ResponseObject refundQuantityProductDetail(@RequestBody List<BillDetailOnline> list){
        return new ResponseObject(paymentsMethodService.refundQuantityProductDetail(list)) ;
    }
    @GetMapping("/bill/{id}")
    public ResponseObject findByIdBill(@PathVariable("id") String id){
        return  new ResponseObject(paymentsMethodService.findByAllIdBill(id));
    }
}
