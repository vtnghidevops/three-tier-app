package com.example.shose.server.dto.request.color;

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */

@Setter
@Getter
public class FindColorRequest extends PageableRequest {

    private String code;

    private String name;

    private String status;
}
