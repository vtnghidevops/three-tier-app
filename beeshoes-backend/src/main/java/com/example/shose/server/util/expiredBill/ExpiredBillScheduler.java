package com.example.shose.server.util.expiredBill;

import com.example.shose.server.entity.BillDetail;
import com.example.shose.server.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

/**
 * @author thangdt
 */
@Configuration
@EnableScheduling
@Scope(proxyMode = ScopedProxyMode.INTERFACES)
@Transactional
public class ExpiredBillScheduler {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillDetailRepository billDetailRepository;

    @Autowired
    private BillHistoryRepository billHistoryRepository;

    @Autowired
    private PaymentsMethodRepository paymentsMethodRepository;

    @Autowired
    private VoucherDetailRepository voucherDetailRepository;

    @Scheduled(cron = "0 0 3 * * ?")
    public void scheduledFixedDelayTask(){
        List<String> bills = billRepository.getAllBillTrash();
        bills.forEach(item ->{
            billDetailRepository.deleteAllByIdBill(item);
            billHistoryRepository.deleteAllByIdBill(item);
            paymentsMethodRepository.deleteAllByIdBill(item);
            voucherDetailRepository.deleteAllByIdBill(item);
            billRepository.deleteById(item);
        });
    }
}
