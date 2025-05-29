package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.ScoringFormulaRequest;
import com.example.shose.server.entity.ScoringFormula;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.repository.ScoringFormulaRepository;
import com.example.shose.server.service.ScoringFormulaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ScoringFormulaServiceImpl implements ScoringFormulaService {

    @Autowired
    private ScoringFormulaRepository scoringFormulaRepository;

    @Override
    public String add(ScoringFormulaRequest request) {
        ScoringFormula scoringFormula = new ScoringFormula();
        scoringFormula.setStatus(Status.DANG_SU_DUNG);
        scoringFormula.setExchangeRatePoin(request.getExchangeRatePoin());
        scoringFormula.setExchangeRateMoney(request.getExchangeRateMoney());
        scoringFormulaRepository.save(scoringFormula);
        return "Thêm thành công";
    }
}
