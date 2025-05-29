package com.example.shose.server.dto.request.notification;

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseNotificationRequest {

    @NotBlank(message = "Vui lòng nhập nội dung của thông báo")
    private String notifyContent;

    @NotBlank(message = "Vui lòng nhập người nhận")
    private String receiver;

    private String idAccount;

    private String idBill;

    private String url;


}
