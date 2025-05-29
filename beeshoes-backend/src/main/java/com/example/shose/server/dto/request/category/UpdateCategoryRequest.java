package com.example.shose.server.dto.request.category;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Getter
@Setter
public class UpdateCategoryRequest extends BaseCategoryRequest{

    private String id;
}
