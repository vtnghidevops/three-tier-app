package com.example.shose.server.dto.response.size;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface GetSizeInProductDetail {
    @Value("#{target.id}")
    String getId();
    @Value("#{target.name}")
    String getName();
}
