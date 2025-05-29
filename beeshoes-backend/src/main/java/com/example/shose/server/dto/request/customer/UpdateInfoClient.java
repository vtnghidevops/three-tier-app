package com.example.shose.server.dto.request.customer;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter

public class UpdateInfoClient {
    private String id;

    private String fullName;

    private Long dateOfBirth;

    private String phoneNumber;

    private String email;

    private Boolean gender;

    private MultipartFile avata;
}
