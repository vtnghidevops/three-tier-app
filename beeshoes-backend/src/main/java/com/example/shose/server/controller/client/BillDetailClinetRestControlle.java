package com.example.shose.server.controller.client;

import com.example.shose.server.dto.request.billdetail.BillDetailRequest;
import com.example.shose.server.service.BillDetailService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangdt
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/bill-detail")
public class BillDetailClinetRestControlle {

    @Autowired
    private BillDetailService billDetailService;

    @GetMapping("")
    public ResponseObject findAllByIdBill(BillDetailRequest request){
        return  new ResponseObject(billDetailService.findAllByIdBill(request));
    }
    @GetMapping("/findByIdBill/{id}")
    public ResponseObject findByIdBill(@PathVariable("id") String id){
        return  new ResponseObject(billDetailService.findAllByIdBill(id));
    }
}
