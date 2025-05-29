package com.example.shose.server.dto.response.bill;

import lombok.*;

/**
 * @author thangdt
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoicePaymentResponse {

    private String total;
    private String method;
    private String status;
    private String vnp_TransactionNo;

}
