package com.example.shose.server.dto.request.employee;

import com.example.shose.server.entity.Account;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Phuong Oanh
 */
@Setter
@Getter
public class UpdateEmployeeRequest extends BaseEmployeeRequest {
    private String id;

    private String password;

    private String email;

}
