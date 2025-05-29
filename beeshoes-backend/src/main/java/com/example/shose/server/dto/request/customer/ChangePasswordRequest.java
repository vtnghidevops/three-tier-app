package com.example.shose.server.dto.request.customer;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    private String id;

    @NotBlank(message = "Nhập mật khẩu mới")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu mới")
    private String confirmPassword;

//    @AssertTrue(message = "Mật khẩu không khớp")
//    private boolean isPasswordMatching() {
//        return newPassword.equals(confirmPassword);
//    }
}
