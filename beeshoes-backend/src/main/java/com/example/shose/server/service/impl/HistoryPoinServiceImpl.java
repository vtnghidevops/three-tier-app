package com.example.shose.server.service.impl;

import com.example.shose.server.dto.response.historypoin.HistoryPoinResponse;
import com.example.shose.server.repository.HistoryPoinRepository;
import com.example.shose.server.service.HistoryPoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author thangdt
 */
@Service
public class HistoryPoinServiceImpl implements HistoryPoinService {

    @Autowired
    private HistoryPoinRepository historyPoinRepository;


    @Override
    public List<HistoryPoinResponse> getAllHisToryPoinByIdUser(String idUser) {
        return historyPoinRepository.getAllHisToryPoinByIdUser(idUser);
    }
}
