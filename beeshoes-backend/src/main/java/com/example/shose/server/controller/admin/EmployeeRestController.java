package com.example.shose.server.controller.admin;


import com.example.shose.server.dto.request.address.CreateAddressRequest;
import com.example.shose.server.dto.request.address.UpdateAddressRequest;
import com.example.shose.server.dto.request.employee.CreateEmployeeRequest;
import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.dto.request.employee.UpdateEmployeeRequest;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.service.EmployeeService;
import com.example.shose.server.util.ResponseObject;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Phuong Oanh
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/employee")
public class EmployeeRestController {
    @Autowired
    private EmployeeService userService;


    @GetMapping()
    public ResponseObject view(final FindEmployeeRequest req) {
        return new ResponseObject(userService.findAll(req));
    }

    @GetMapping("/search-date")
    public ResponseObject searchDate(final FindEmployeeRequest rep) {
        return new ResponseObject(userService.searchDate(rep));
    }

    @PostMapping
    public ResponseObject add(@RequestParam("request") String req,
                              @RequestParam("multipartFile") MultipartFile file) {

        JsonObject jsonObject = JsonParser.parseString(req).getAsJsonObject();

        CreateEmployeeRequest employeeRequest = new CreateEmployeeRequest();
        employeeRequest.setFullName(jsonObject.get("fullName").getAsString());
        employeeRequest.setPhoneNumber(jsonObject.get("phoneNumber").getAsString());
        employeeRequest.setEmail(jsonObject.get("email").getAsString());
        employeeRequest.setGender(Boolean.valueOf(jsonObject.get("gender").getAsString()));
        employeeRequest.setStatus(Status.valueOf(jsonObject.get("status").getAsString()));
        employeeRequest.setDateOfBirth(Long.valueOf(jsonObject.get("dateOfBirth").getAsString()));
        employeeRequest.setCitizenIdentity(jsonObject.get("citizenIdentity").getAsString());
        // add địa chỉ
        CreateAddressRequest addressRequest = new CreateAddressRequest();
        addressRequest.setLine(jsonObject.get("line").getAsString());
        addressRequest.setProvince(jsonObject.get("province").getAsString());
        addressRequest.setDistrict(jsonObject.get("district").getAsString());
        addressRequest.setWard(jsonObject.get("ward").getAsString());
        addressRequest.setWardCode(jsonObject.get("wardCode").getAsString());
        addressRequest.setToDistrictId(Integer.valueOf(jsonObject.get("toDistrictId").getAsString()));
        addressRequest.setProvinceId(Integer.valueOf(jsonObject.get("provinceId").getAsString()));
        return new ResponseObject(userService.create(employeeRequest,addressRequest,file));
    }
    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(userService.getOneById(id));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestParam("request") String req,
                                 @RequestParam("multipartFile") MultipartFile file) {
        JsonObject jsonObject = JsonParser.parseString(req).getAsJsonObject();

        UpdateEmployeeRequest employeeRequest = new UpdateEmployeeRequest();
        employeeRequest.setId(id);
        employeeRequest.setFullName(jsonObject.get("fullName").getAsString());
        employeeRequest.setPhoneNumber(jsonObject.get("phoneNumber").getAsString());
        employeeRequest.setEmail(jsonObject.get("email").getAsString());
        employeeRequest.setGender(Boolean.valueOf(jsonObject.get("gender").getAsString()));
        employeeRequest.setStatus(Status.valueOf(jsonObject.get("status").getAsString()));
        employeeRequest.setDateOfBirth(Long.valueOf(jsonObject.get("dateOfBirth").getAsString()));
        employeeRequest.setCitizenIdentity(jsonObject.get("citizenIdentity").getAsString());

        // update địa chỉ
        UpdateAddressRequest addressRequest = new UpdateAddressRequest();
        addressRequest.setLine(jsonObject.get("line").getAsString());
        addressRequest.setProvince(jsonObject.get("province").getAsString());
        addressRequest.setDistrict(jsonObject.get("district").getAsString());
        addressRequest.setWard(jsonObject.get("ward").getAsString());
        addressRequest.setWardCode(jsonObject.get("wardCode").getAsString());
        addressRequest.setToDistrictId(Integer.valueOf(jsonObject.get("toDistrictId").getAsString()));
        addressRequest.setProvinceId(Integer.valueOf(jsonObject.get("provinceId").getAsString()));
        addressRequest.setUserId(id);

        return new ResponseObject(userService.update(employeeRequest,addressRequest,file));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(userService.delete(id));
    }
}
