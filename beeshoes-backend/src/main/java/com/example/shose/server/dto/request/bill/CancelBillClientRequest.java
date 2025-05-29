package com.example.shose.server.dto.request.bill;

import lombok.Getter;
import lombok.Setter;

/*
 *  @author diemdz
 */
@Getter
@Setter
public class CancelBillClientRequest {
    private String id;
    private String description;
}
