package com.example.shose.server.service.impl;

import com.example.shose.server.dto.response.ImageResponse;
import com.example.shose.server.repository.ImageRepository;
import com.example.shose.server.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImagesServiceImpl implements ImagesService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public List<ImageResponse> findAllByIdProductDetail(String id) {
        return imageRepository.findAllByIdProductDetail(id);
    }
}
