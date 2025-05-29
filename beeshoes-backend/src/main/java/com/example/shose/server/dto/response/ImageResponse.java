package com.example.shose.server.dto.response;

import org.springframework.beans.factory.annotation.Value;

public interface ImageResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.name}")
    String getName();

    @Value("#{target.status}")
    String getStatus();
}
