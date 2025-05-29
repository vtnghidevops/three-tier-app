package com.example.shose.server.dto.request.customer;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Phuong Oanh
 */
@Setter
@Getter
public class UpdateCustomerRequest extends BaseCustomerRequest {
    private String id;

}
