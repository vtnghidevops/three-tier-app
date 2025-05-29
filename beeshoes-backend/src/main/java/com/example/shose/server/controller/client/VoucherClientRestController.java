package com.example.shose.server.controller.client;

import com.example.shose.server.service.CategoryService;
import com.example.shose.server.service.VoucherService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/voucher")
public class VoucherClientRestController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping("/{code}")
    public ResponseObject getByCode(@PathVariable("code") String code) {
        return new ResponseObject(voucherService.getByCode(code));
    }
    @GetMapping("/account/{idAccount}")
    public ResponseObject getVoucherByIdAccount() {
        return new ResponseObject(voucherService.getVoucherByIdAccount());
    }
    @GetMapping("/list")
    public ResponseObject getListVoucher() {
        return new ResponseObject(voucherService.getAllHaveQuantity());
    }
}
