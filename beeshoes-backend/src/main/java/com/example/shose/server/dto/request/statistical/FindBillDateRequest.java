package com.example.shose.server.dto.request.statistical;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Hào Ngô
 */
@Getter
@Setter
public class FindBillDateRequest {
    private Long startDate;

    private Long endDate;
}
