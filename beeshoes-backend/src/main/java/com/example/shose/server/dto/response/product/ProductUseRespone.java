package com.example.shose.server.dto.response.product;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface ProductUseRespone {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.nameProduct}")
    String getName();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.code}")
    String getCode();


}
