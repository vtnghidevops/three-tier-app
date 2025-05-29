package com.example.shose.server.dto.response.brand;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface GetBrandInProductDetail {
    @Value("#{target.id}")
    String getId();
    @Value("#{target.name}")
    String getName();
}
