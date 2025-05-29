package com.example.shose.server.dto.request.product;
/*
 *  @author diemdz
 */

import com.example.shose.server.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindProductUseRequest extends PageableRequest {

    private String keyword;

}