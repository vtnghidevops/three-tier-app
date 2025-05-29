package com.example.shose.server.dto.response.sole;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface GetSoleInProductDetail {
    @Value("#{target.id}")
    String getId();
    @Value("#{target.name}")
    String getName();
}
