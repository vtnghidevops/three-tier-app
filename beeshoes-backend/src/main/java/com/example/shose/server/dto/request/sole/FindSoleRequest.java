package com.example.shose.server.dto.request.sole;

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Setter
@Getter
public class FindSoleRequest extends PageableRequest {

    private String name;

    private String status;
}
