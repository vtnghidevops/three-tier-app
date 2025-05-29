package com.example.shose.server.dto.response;

import com.example.shose.server.dto.response.base.BaseResponse;
import com.example.shose.server.entity.Color;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author Nguyễn Vinh
 */
@Projection(types = Color.class)
public interface ColorResponse extends BaseResponse {

    @Value("#{target.code}")
    String getCode();
}
