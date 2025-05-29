package com.example.shose.server.controller.admin;

import com.example.shose.server.repository.VoucherDetailRepository;
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
@RequestMapping("/admin/voucher-detail")
public class VoucherDetailResController {

    @Autowired
    private VoucherDetailRepository voucherDetailRepository;

    @GetMapping("/{idbill}")
    public ResponseObject getVoucherDetailByIdBill(@PathVariable("idbill") String idbill) {
        return new ResponseObject(voucherDetailRepository.getVoucherDetailByIdBill(idbill));
    }
}
