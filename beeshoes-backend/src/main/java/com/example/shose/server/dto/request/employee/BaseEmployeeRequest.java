package com.example.shose.server.dto.request.employee;

import com.example.shose.server.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Phuong Oanh
 */
@Getter
@Setter
public abstract class BaseEmployeeRequest {
    private String fullName;

    private Long dateOfBirth;

    private String phoneNumber;

    private String email;

    private Boolean gender;

    private String avata;

    private Status status;

    private Integer points;

    private String id;

    private String citizenIdentity;
}
