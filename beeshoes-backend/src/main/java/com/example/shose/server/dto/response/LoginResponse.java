package com.example.shose.server.dto.response;

import com.example.shose.server.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private String idAccount;

    private String idUser;

    private String fullName;

    private String phoneNumber;

    private String avata;

    private Boolean gender;

    private String email;

    private String roles;

    public LoginResponse(Account account) {
        this.idAccount = account.getId();
        this.idUser = account.getUser().getId();
        this.fullName = account.getUser().getFullName();
        this.phoneNumber = account.getUser().getPhoneNumber();
        this.avata = account.getUser().getAvata();
        this.gender = account.getUser().getGender();
        this.email = account.getEmail();
        this.roles = account.getRoles().name();
    }

}
