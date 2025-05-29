package com.example.shose.server.service.impl;
/*
 *  @author diemdz
 */

import com.example.shose.server.dto.request.voucher.CreateVoucherRequest;
import com.example.shose.server.dto.request.voucher.FindVoucherRequest;
import com.example.shose.server.dto.request.voucher.UpdateVoucherRequest;
import com.example.shose.server.dto.response.voucher.VoucherRespone;
import com.example.shose.server.entity.Voucher;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusPromotion;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.VoucherRepository;
import com.example.shose.server.service.VoucherService;
import com.example.shose.server.util.ConvertDateToLong;
import com.example.shose.server.util.RandomNumberGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Override
    public List<VoucherRespone> getAll(FindVoucherRequest findVoucherRequest) {
        return voucherRepository.getAllVoucher(findVoucherRequest);
    }

    @Override
    public List<Voucher> findAll() {
        return voucherRepository.getAllHaveQuantity();
    }

    @Override
    public List<Voucher> getAllHaveQuantity() {
        return voucherRepository.getAllHaveQuantity();
    }

    @Override
    public Voucher add(CreateVoucherRequest request) throws RestApiException {
        Optional<Voucher>  optional = voucherRepository.findByName(request.getName());
        if(optional.isPresent()){
            throw new RestApiException("Tên khuyến mãi đã tồn tại");
        }
        if(request.getEndDate() <= request.getStartDate()){
            throw new RestApiException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }
        long currentSeconds = (System.currentTimeMillis() / 1000) * 1000;
        if(request.getEndDate() <=currentSeconds){
            throw new RestApiException("Ngày kết thúc phải lớn hơn hiện tại");
        }
        Status status = (request.getStartDate() > currentSeconds) ? Status.CHUA_KICH_HOAT : (currentSeconds >= request.getEndDate()  ? Status.KHONG_SU_DUNG : Status.DANG_SU_DUNG);
           Voucher voucher = Voucher.builder()
                   .code(new RandomNumberGenerator().randomToString("VC",999999999))
                   .name(request.getName())
                   .value(request.getValue())
                   .quantity(request.getQuantity())
                   .startDate(request.getStartDate())
                   .endDate(request.getEndDate())
                   .status(status)
                   .minimumBill(request.getMinimumBill())
                   .build();
           return voucherRepository.save(voucher);
    }

    @Override
    public Voucher update(UpdateVoucherRequest request) throws RestApiException {
        Optional<Voucher> optional = voucherRepository.findById(request.getId());
        if (!optional.isPresent()) {
            throw new RestApiException("Khuyến mãi không tồn tại");
        }
        Voucher voucher = optional.get();
        voucher.setName(request.getName());
        voucher.setValue(request.getValue());
        voucher.setQuantity(request.getQuantity());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setMinimumBill(request.getMinimumBill());
        if(request.getEndDate() <= request.getStartDate()){
            throw new RestApiException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }
        long currentSeconds = (System.currentTimeMillis() / 1000) * 1000;
        Status status = (request.getStartDate() > currentSeconds) ? Status.CHUA_KICH_HOAT : (currentSeconds >= request.getEndDate()  ? Status.KHONG_SU_DUNG : Status.DANG_SU_DUNG);
        voucher.setStatus(status);
        return voucherRepository.save(voucher);
    }

    @Override
    public Voucher updateStatus(String id) throws RestApiException {
        Optional<Voucher> optional = voucherRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException("Khuyến mãi không tồn tại");
        }
        Voucher voucher = optional.get();
        long currentSeconds = System.currentTimeMillis();
        if(voucher.getEndDate()<= currentSeconds){
            voucher.setStatus(Status.KHONG_SU_DUNG);
        } else if (voucher.getEndDate()>= currentSeconds) {
            voucher.setStatus(Status.DANG_SU_DUNG);
        }
        voucherRepository.save(voucher);
        return voucher;
    }

    @Override
    public Voucher updateStatusQuantity(String id) throws RestApiException {
        Optional<Voucher> optional = voucherRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException("Khuyến mãi không tồn tại");
        }
        Voucher voucher = optional.get();
         if(voucher.getQuantity()<1){
            voucher.setStatus(Status.KHONG_SU_DUNG);
        }
        voucherRepository.save(voucher);
        return voucher;
    }

    @Override
    public Boolean delete(String id) {
        Optional<Voucher> voucher = voucherRepository.findById(id);
        voucherRepository.delete(voucher.get());
        return true;
    }

    @Override
    public Voucher getById(String id) {
        Voucher voucher = voucherRepository.findById(id).get();
        return voucher;
    }

    @Override
    public List<Voucher> expiredVoucher() {
        List<Voucher> expiredVouchers = voucherRepository.findExpiredVouchers(( System.currentTimeMillis() / 1000)*1000);
        for (Voucher voucher : expiredVouchers) {
            voucher.setStatus(Status.KHONG_SU_DUNG);
            voucherRepository.save(voucher);
        }
        return expiredVouchers;
    }

    @Override
    public List<Voucher> startVoucher() {
        List<Voucher> startVouchers = voucherRepository.findStartVouchers(( System.currentTimeMillis() / 1000)*1000);
        for (Voucher voucher : startVouchers) {
            voucher.setStatus(Status.DANG_SU_DUNG);
            voucherRepository.save(voucher);
        }
        return startVouchers;
    }

    @Override
    public Voucher getByCode(String code) {
        return voucherRepository.getByCode(code);
    }

    @Override
    public List<Voucher> getVoucherByIdAccount() {
        return voucherRepository.findAll();
    }

    @Override
    public VoucherRespone getVoucherByMinimum(int minimum) {
        return voucherRepository.getVoucherByMinimum(minimum);
    }

}
