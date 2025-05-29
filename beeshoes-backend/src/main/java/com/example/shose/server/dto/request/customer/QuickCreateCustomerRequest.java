package com.example.shose.server.dto.request.customer;

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Hào Ngô
 */
@Getter
@Setter
public class QuickCreateCustomerRequest {

    @NotBlank(message = "Vui lòng không để trống tên")
    private String fullName;

    @NotBlank(message = "Vui lòng không để trống số điện thoại")
    private String phoneNumber;

    private String email;

    private Boolean gender;
}
