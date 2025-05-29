package com.example.shose.server.dto.response;

import com.example.shose.server.dto.response.base.BaseResponse;
import com.example.shose.server.entity.Material;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author Nguyễn Vinh
 */
@Projection(types = Material.class)
public interface MaterialResponse extends BaseResponse {

}
