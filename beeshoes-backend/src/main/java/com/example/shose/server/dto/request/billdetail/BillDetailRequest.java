package com.example.shose.server.dto.request.billdetail;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
@AllArgsConstructor
public class BillDetailRequest {

    @NotEmpty
    private String idBill;

    private String status;
}
