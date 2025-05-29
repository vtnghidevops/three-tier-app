package com.example.shose.server.service.impl;

import com.example.shose.server.dto.response.billhistory.BillHistoryResponse;
import com.example.shose.server.entity.BillHistory;
import com.example.shose.server.repository.BillHistoryRepository;
import com.example.shose.server.service.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author thangdt
 */
@Service
public class BillHistoryServiceImpl implements BillHistoryService {

    @Autowired
    private BillHistoryRepository billHistoryRepository;

    @Override
    public List<BillHistoryResponse> findAllByIdBill(String idBill) {
        return billHistoryRepository.findAllByIdBill(idBill);
    }
    @Override
    public List<BillHistory> getBillHistoryByIdBill(String idBill) {
        return billHistoryRepository.getBillHistoryByIdBill(idBill);
    }
}
