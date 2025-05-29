package com.example.shose.server.dto.response.cart;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

public interface ListSizeOfItemCart {
    @Value("#{target.nameSize}")
    String getNameSize();

    @Value("#{target.idProduct}")
    String getIdProduct();
    @Value("#{target.codeColor}")
    String getCodeColor();

}
