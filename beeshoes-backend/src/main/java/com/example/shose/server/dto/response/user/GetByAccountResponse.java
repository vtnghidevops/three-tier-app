package com.example.shose.server.dto.response.user;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface GetByAccountResponse {
    @Value("#{target.id}")
    String getId();
}
