package com.example.shose.server.dto.response.category;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

/*
 *  @author diemdz
 */

public interface GetCategoryInProductDetail {
    @Value("#{target.id}")
    String getId();
    @Value("#{target.name}")
    String getName();
}
