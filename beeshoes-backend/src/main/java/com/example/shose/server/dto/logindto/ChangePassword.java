package com.example.shose.server.dto.logindto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChangePassword {

    private String password;

    private String newPassword;
}
