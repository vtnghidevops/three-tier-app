package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.color.CreateColorRequest;
import com.example.shose.server.dto.request.color.FindColorRequest;
import com.example.shose.server.dto.request.color.UpdateColorRequest;
import com.example.shose.server.dto.response.ColorResponse;
import com.example.shose.server.dto.response.color.GetColorInProductDetail;
import com.example.shose.server.entity.Color;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.ColorRepository;
import com.example.shose.server.service.ColorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;

/**
 * @author Nguyễn Vinh
 */
@Service
@Validated
public class ColorServiceImpl implements ColorService {

    @Autowired
    private ColorRepository colorRepository;

    @Override
    public List<ColorResponse> findAll(FindColorRequest req) {
        return colorRepository.getAll(req);
    }

    @Override
    public Color create(@Valid CreateColorRequest req) {
        Color checkName = colorRepository.getOneByCode(req.getCode());
        if (checkName != null) {
            throw new RestApiException(Message.COLOR_NAME_EXISTS);
        }
        Color add = new Color();
        add.setName(req.getName());
        add.setStatus(Status.valueOf(req.getStatus()));
        add.setCode(req.getCode());
        return colorRepository.save(add);
    }

    @Override
    public Color update(@Valid UpdateColorRequest req) {
        Optional<Color> optional = colorRepository.findById(req.getId());
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        Color existence = colorRepository.getByNameExistence(req.getName(), req.getId());
        if (existence != null) {
            throw new RestApiException(Message.NAME_EXISTS);
        }
        Color update = optional.get();
        update.setCode(req.getCode());
        update.setName(req.getName());
        update.setStatus(Status.valueOf(req.getStatus()));
        return colorRepository.save(update);
    }

    @Override
    public Boolean delete(String id) {
        Optional<Color> optional = colorRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        colorRepository.delete(optional.get());
        return true;
    }

    @Override
    public Color getOneById(String id) {
        Optional<Color> optional = colorRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return optional.get();
    }

    @Override
    public List<Color> getAllCode() {
        return colorRepository.getAllCode();
    }

    @Override
    public List<GetColorInProductDetail> getColorInProductDetail() {
        return colorRepository.getColorInProductDetail();
    }
}
