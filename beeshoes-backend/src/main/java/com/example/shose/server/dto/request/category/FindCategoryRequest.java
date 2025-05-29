package com.example.shose.server.dto.request.category;

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Setter
@Getter
public class FindCategoryRequest extends PageableRequest {

    private String name;

    private String status;
}
