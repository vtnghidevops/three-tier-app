package com.example.shose.server.service;

import com.example.shose.server.dto.request.address.CreateAddressRequest;
import com.example.shose.server.dto.request.address.UpdateAddressRequest;
import com.example.shose.server.dto.request.customer.CreateCustomerRequest;
import com.example.shose.server.dto.request.customer.QuickCreateCustomerRequest;
import com.example.shose.server.dto.request.customer.UpdateCustomerRequest;
import com.example.shose.server.dto.request.customer.UpdateInfoClient;
import com.example.shose.server.dto.request.employee.CreateEmployeeRequest;
import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.dto.request.employee.UpdateEmployeeRequest;
import com.example.shose.server.dto.response.EmployeeResponse;
import com.example.shose.server.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author Phuong Oanh
 */
public interface CustomerService {

    List<EmployeeResponse> findAll(FindEmployeeRequest req);

    List<EmployeeResponse> searchDate(final FindEmployeeRequest req);

    User create(CreateCustomerRequest request,
                CreateAddressRequest addressRequest,
                MultipartFile file);

    User update(UpdateCustomerRequest request,
                UpdateAddressRequest addressRequest,
                MultipartFile file);
    User updateInfoClient(UpdateInfoClient request);

    Boolean delete(String id);

    EmployeeResponse getOneById(String id);

    User quickCreate(QuickCreateCustomerRequest request,
                     CreateAddressRequest addressRequest
                     );

    EmployeeResponse getOneByPhoneNumber(String phoneNumber);

    User findByEmail(String email);
}
