package com.example.shose.server.service.impl;

import com.example.shose.server.entity.ScoringFormula;
import com.example.shose.server.infrastructure.poin.ConfigPoin;
import com.example.shose.server.infrastructure.poin.Poin;
import com.example.shose.server.repository.ScoringFormulaRepository;
import com.example.shose.server.service.PoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author thangdt
 */
@Service
public class PoinServiceImpl implements PoinService {

    @Autowired
    private ScoringFormulaRepository scoringFormulaRepository;

    @Override
    public ScoringFormula getDetailPoin() {
        List<ScoringFormula> scoringFormulas = scoringFormulaRepository.findAllByOrderByCreatedDateDesc();
        if (scoringFormulas.isEmpty()) {
            return ScoringFormula.builder().exchangeRatePoin(new BigDecimal(0)).exchangeRatePoin(new BigDecimal(0)).build();
        }
        return scoringFormulas.get(0);
    }
}
