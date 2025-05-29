package com.example.shose.server.dto.request.brand;

import com.example.shose.server.infrastructure.common.PageableRequest;
import com.example.shose.server.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Getter
@Setter
public class FindBrandRequest extends PageableRequest {

    private String name;

    private String status;
}
