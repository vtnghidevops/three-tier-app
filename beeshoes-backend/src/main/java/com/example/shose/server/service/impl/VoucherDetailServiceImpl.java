package com.example.shose.server.service.impl;

import com.example.shose.server.dto.response.voucher.VoucherDetailCustomAtCountry;
import com.example.shose.server.repository.VoucherDetailRepository;
import com.example.shose.server.repository.VoucherRepository;
import com.example.shose.server.service.VoucherDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author thangdt
 */
@Service
public class VoucherDetailServiceImpl implements VoucherDetailService {
    @Autowired
    private VoucherDetailRepository voucherDetailRepository;

    @Override
    public VoucherDetailCustomAtCountry getVoucherDetailByIdBill(String idBill) {
        return voucherDetailRepository.getVoucherDetailByIdBill(idBill);
    }
}
