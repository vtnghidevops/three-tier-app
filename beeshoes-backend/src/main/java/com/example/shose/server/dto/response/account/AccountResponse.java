package com.example.shose.server.dto.response.account;

import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.Address;
import com.example.shose.server.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.UUID;

/**
 * @author thangdt
 */
@Projection(types = {Account.class, User.class})
public interface AccountResponse {

    @Value("#{target.id}")
    UUID getId();

    @Value("#{target.fullName}")
    String getFullName();

    @Value("#{target.phoneNumber}")
    String getPhoneNumber();

    @Value("#{target.email}")
    String getEmail();

    @Value("#{target.points}")
    int getPoints();

}
