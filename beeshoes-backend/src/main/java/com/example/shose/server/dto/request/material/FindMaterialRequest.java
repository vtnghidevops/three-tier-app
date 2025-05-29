package com.example.shose.server.dto.request.material;

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Getter
@Setter
public class FindMaterialRequest extends PageableRequest {

    private String name;

    private String status;
}
