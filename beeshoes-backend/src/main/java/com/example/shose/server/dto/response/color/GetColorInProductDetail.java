package com.example.shose.server.dto.response.color;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface GetColorInProductDetail {
    @Value("#{target.code}")
    String getCode();
    @Value("#{target.name}")
    String getName();
}
