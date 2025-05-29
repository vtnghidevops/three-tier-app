package com.example.shose.server.service;

import com.example.shose.server.dto.request.address.CreateAddressRequest;
import com.example.shose.server.dto.request.address.UpdateAddressRequest;
import com.example.shose.server.dto.request.employee.CreateEmployeeRequest;
import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.dto.request.employee.UpdateEmployeeRequest;
import com.example.shose.server.dto.response.EmployeeResponse;
import com.example.shose.server.dto.response.user.SimpleUserResponse;
import com.example.shose.server.entity.User;
import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author Phuong Oanh
 */
public interface EmployeeService {

    List<EmployeeResponse> findAll( FindEmployeeRequest req);

    List<EmployeeResponse> searchDate(final FindEmployeeRequest req);

    User create(CreateEmployeeRequest req , CreateAddressRequest addressRequest,
                MultipartFile file);

    User update(final UpdateEmployeeRequest req,  UpdateAddressRequest addressRequest,
                MultipartFile file);

    Boolean delete(String id);

    EmployeeResponse  getOneById(String id);
}
