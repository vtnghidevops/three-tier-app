package com.example.shose.server.dto.response.bill;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
@Builder
public class RollBackBillResponse {

    private String code;

    private String fullName;

    private String note;

    private String url;

}
