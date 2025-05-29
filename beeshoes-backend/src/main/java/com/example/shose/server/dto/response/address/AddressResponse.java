package com.example.shose.server.dto.response.address;

import com.example.shose.server.entity.Address;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author Hào Ngô
 */
@Projection(types = {Address.class})
public interface AddressResponse {
    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.id}")
    String getId();
    @Value("#{target.line}")
    String getLine();

    @Value("#{target.district}")
    String getDistrict();

    @Value("#{target.province}")
    String getProvince();

    @Value("#{target.ward}")
    String getWard();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.createdDate}")
    Long getCreatedDate();

    @Value("#{target.lastModifiedDate}")
    Long getLastModifiedDate();

}
