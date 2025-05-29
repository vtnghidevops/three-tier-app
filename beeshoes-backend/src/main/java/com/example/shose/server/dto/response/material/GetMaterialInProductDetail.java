package com.example.shose.server.dto.response.material;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface GetMaterialInProductDetail {
    @Value("#{target.id}")
    String getId();
    @Value("#{target.name}")
    String getName();
}
