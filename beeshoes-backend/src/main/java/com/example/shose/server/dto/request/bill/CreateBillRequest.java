package com.example.shose.server.dto.request.bill;

import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
public class CreateBillRequest {

    private String idUser;

    private String name;

    private String phoneNumber;

    private String address;
}
