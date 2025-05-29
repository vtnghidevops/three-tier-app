package com.example.shose.server.dto.request.bill;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 *  @author diemdz
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusRequest {
    private String id;
    private String status;
}
