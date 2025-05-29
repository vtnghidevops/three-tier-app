package com.example.shose.server.dto.request.address;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Hào Ngô
 */
@Getter
@Setter
public class UpdateAddressRequest extends BaseAddressRequest {

    private String id;
}
