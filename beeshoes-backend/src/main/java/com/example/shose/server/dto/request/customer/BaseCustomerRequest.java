package com.example.shose.server.dto.request.customer;

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Phuong Oanh
 */
@Getter
@Setter
public abstract class BaseCustomerRequest {
    @NotBlank(message = "Vui lòng không để trống tên")
    private String fullName;

    @NotBlank(message = "Vui lòng không để trống ngày sinh")
    private Long dateOfBirth;

    @NotBlank(message = "Vui lòng không để trống số điện thoại")
    private String phoneNumber;

    @NotBlank(message = "Vui lòng không để trống email")
    private String email;

    private Boolean gender;

    private String avata;

    private Status status;

    private String password;

    private Integer points;

    private String citizenIdentity;

}
