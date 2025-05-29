package com.example.shose.server.dto.request.address;

import com.example.shose.server.infrastructure.common.PageableRequest;
import com.example.shose.server.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Hào Ngô
 */
@Getter
@Setter
public class FindAddressRequest extends PageableRequest {

    private String line;

    private String district;

    private String province;

    private String ward;

    private Status status;

    private String id_user;

}
