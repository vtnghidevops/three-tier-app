package com.example.shose.server.infrastructure.sercurity.auth;

import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Roles;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SignUpRequets {

    @NotBlank(message = "Email trống")
    private String email;

    @NotBlank(message = "Mật khẩu trống")
    @Pattern(regexp = "^(?=.*[0-9])(.{8,})$", message = "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 số")
    private String password;

    private Roles roles;

    private String phoneNumber;
}
