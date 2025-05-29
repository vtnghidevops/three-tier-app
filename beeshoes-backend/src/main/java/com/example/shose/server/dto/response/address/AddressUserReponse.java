package com.example.shose.server.dto.response.address;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author Hào Ngô
 */
public interface AddressUserReponse {
    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.address}")
    String getAddress();

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

    @Value("#{target.fullName}")
    String getFullName();

    @Value("#{target.phoneNumber}")
    String getPhoneNumber();

    @Value("#{target.provinceId}")
    String getProvinceId();

    @Value("#{target.toDistrictId}")
    String getToDistrictId();

    @Value("#{target.wardCode}")
    String getWardCode();

    @Value("#{target.userId}")
    String getUserId();
}
