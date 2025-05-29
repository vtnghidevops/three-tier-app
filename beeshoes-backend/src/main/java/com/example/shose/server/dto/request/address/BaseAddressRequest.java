package com.example.shose.server.dto.request.address;

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Hào Ngô
 */

@Getter
@Setter
public abstract class BaseAddressRequest {

    private String id;

    @NotBlank(message = "Vui lòng không để trống tên đường")
    private String line;

    @NotBlank(message = "Vui lòng không để trống tên quận, huyện")
    private String district;

    @NotBlank(message = "Vui lòng không để trống tên tỉnh, thành phố")
    private String province;

    @NotBlank(message = "Vui lòng không để trống tên xã")
    private String ward;

    private Integer provinceId;

    private Integer toDistrictId;

    private String wardCode;

    private Status status;

    private String userId;

    @NotBlank(message = "Vui lòng không để trống tên")
    private String fullName;

    @NotBlank(message = "Vui lòng không để trống số điện thoại")
    private String phoneNumber;
}
