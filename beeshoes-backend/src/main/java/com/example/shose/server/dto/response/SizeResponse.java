package com.example.shose.server.dto.response;

import com.example.shose.server.dto.response.base.BaseResponse;
import com.example.shose.server.entity.Size;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author Nguyễn Vinh
 */
@Projection(types = Size.class)
public interface SizeResponse extends BaseResponse {
}
