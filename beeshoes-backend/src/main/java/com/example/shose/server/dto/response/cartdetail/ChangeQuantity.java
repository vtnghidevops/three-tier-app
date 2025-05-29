package com.example.shose.server.dto.response.cartdetail;
/*
 *  @author diemdz
 */

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeQuantity {
    String idCartDetail;
    Integer quantity;
}
