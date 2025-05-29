package com.example.shose.server.dto.response;

import com.example.shose.server.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author Phuong Oanh
 */
@Projection(types = User.class)
public interface EmployeeResponse {
    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.email}")
    String getEmail();

    @Value("#{target.createdDate}")
    Long getCreatedDate();

    @Value("#{target.lastModifiedDate}")
    Long getLastModifiedDate();

    @Value("#{target.avata}")
    String getAvata();

    @Value("#{target.points}")
    String getPoints();

    @Value("#{target.phoneNumber}")
    String getPhoneNumber();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.createdBy}")
    String getCreateBy();

    @Value("#{target.updatedBy}")
    String getUpdateBy();

    @Value("#{target.dateOfBirth}")
    Long getDateOfBirth();

    @Value("#{target.fullName}")
    String getFullName();

    @Value("#{target.password}")
    String getPassword();

    @Value("#{target.gender}")
    Boolean getGender();

    @Value("#{target.idAccount}")
    String getIdAccount();

    @Value("#{target.citizenIdentity}")
    String getCitizenIdentity();
}
