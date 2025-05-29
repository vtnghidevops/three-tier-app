package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.payMentMethod.CreatePayMentMethodTransferRequest;
import com.example.shose.server.dto.request.paymentsmethod.CreatePaymentsMethodRequest;
import com.example.shose.server.dto.response.payment.PayMentVnpayResponse;
import com.example.shose.server.infrastructure.session.ShoseSession;
import com.example.shose.server.service.PaymentsMethodService;
import com.example.shose.server.util.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.UnsupportedEncodingException;
import java.util.List;


/**
 * @author thangdt
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/payment")
public class PaymentsMethodRestController {

    @Autowired
    private ShoseSession shoseSession;

    @Autowired
    private PaymentsMethodService paymentsMethodService;

    @GetMapping("/bill/{id}")
    public ResponseObject findByIdBill(@PathVariable("id") String id){
        return  new ResponseObject(paymentsMethodService.findByAllIdBill(id));
    }

    @PostMapping("/bill/{id}")
    public ResponseObject create(@PathVariable("id") String id, @RequestBody CreatePaymentsMethodRequest request){
        return  new ResponseObject(paymentsMethodService.create(id, shoseSession.getEmployee().getId(), request));
    }

    @GetMapping("/total-money/{id}")
    public ResponseObject sumTotalMoneyByIdBill(@PathVariable("id")  String idBill){
        return  new ResponseObject(paymentsMethodService.sumTotalMoneyByIdBill(idBill));
    }

    @PutMapping("/update-status/{id}")
    public ResponseObject sumTotalMoneyByIdBill(@PathVariable("id")  String idBill, @RequestBody() List<String> ids){
        return  new ResponseObject(paymentsMethodService.updatepayMent(idBill, shoseSession.getEmployee().getId(), ids));
    }


    @PostMapping("/payment-vnpay")
    public ResponseObject pay(@RequestBody CreatePayMentMethodTransferRequest payModel, HttpServletRequest request){
        try {
            return new ResponseObject(paymentsMethodService.payWithVNPAY(payModel, request)) ;
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/payment-success")
    public ResponseObject pay(final PayMentVnpayResponse response){
    return new ResponseObject(paymentsMethodService.paymentSuccess(shoseSession.getEmployee().getId(), response)) ;
    }

    @PostMapping("/refund-payment/{id}")
    public ResponseObject refundPayment(@RequestBody CreatePaymentsMethodRequest request, @PathVariable("id") String id){
        return new ResponseObject(paymentsMethodService.refundPayment(shoseSession.getEmployee().getId(), id, request)) ;
    }
}
