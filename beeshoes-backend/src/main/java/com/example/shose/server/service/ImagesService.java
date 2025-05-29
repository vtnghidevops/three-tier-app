package com.example.shose.server.service;

import com.example.shose.server.dto.response.ImageResponse;

import java.util.List;

public interface ImagesService {

    List<ImageResponse> findAllByIdProductDetail(String id);
}
