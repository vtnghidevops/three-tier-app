package com.example.shose.server.controller.admin;


import com.example.shose.server.dto.request.address.CreateAddressRequest;
import com.example.shose.server.dto.request.address.UpdateAddressRequest;
import com.example.shose.server.dto.request.customer.CreateCustomerRequest;
import com.example.shose.server.dto.request.customer.QuickCreateCustomerRequest;
import com.example.shose.server.dto.request.customer.UpdateCustomerRequest;
import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.dto.request.productdetail.UpdateProductDetailRequest;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.service.CustomerService;
import com.example.shose.server.util.ResponseObject;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@RequestMapping("/admin/customer")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;

    @GetMapping()
    public ResponseObject view(final FindEmployeeRequest req) {
        return new ResponseObject(customerService.findAll(req));
    }

    @GetMapping("/search-date")
    public ResponseObject searchDate(final FindEmployeeRequest rep) {
        return new ResponseObject(customerService.searchDate(rep));
    }

    @PostMapping
    public ResponseObject add(@RequestParam("request") String req,
                              @RequestParam("multipartFile") MultipartFile file) {

        JsonObject jsonObject = JsonParser.parseString(req).getAsJsonObject();

        // add khách hàng
        CreateCustomerRequest customerRequest = new CreateCustomerRequest();
        customerRequest.setFullName(jsonObject.get("fullName").getAsString());
        customerRequest.setPhoneNumber(jsonObject.get("phoneNumber").getAsString());
        customerRequest.setEmail(jsonObject.get("email").getAsString());
        customerRequest.setGender(Boolean.valueOf(jsonObject.get("gender").getAsString()));
        customerRequest.setStatus(Status.valueOf(jsonObject.get("status").getAsString()));
        customerRequest.setDateOfBirth(Long.valueOf(jsonObject.get("dateOfBirth").getAsString()));
        customerRequest.setCitizenIdentity(jsonObject.get("citizenIdentity").getAsString());

        // add địa chỉ
        CreateAddressRequest addressRequest = new CreateAddressRequest();
        addressRequest.setLine(jsonObject.get("line").getAsString());
        addressRequest.setProvince(jsonObject.get("province").getAsString());
        addressRequest.setDistrict(jsonObject.get("district").getAsString());
        addressRequest.setWard(jsonObject.get("ward").getAsString());
        addressRequest.setToDistrictId(Integer.valueOf(jsonObject.get("toDistrictId").getAsString()));
        addressRequest.setProvinceId(Integer.valueOf(jsonObject.get("provinceId").getAsString()));
        addressRequest.setWardCode(jsonObject.get("wardCode").getAsString());

        return new ResponseObject(customerService.create(customerRequest, addressRequest, file));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(customerService.getOneById(id));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestParam("request") String req,
                                 @RequestParam("multipartFile") MultipartFile file) {
        JsonObject jsonObject = JsonParser.parseString(req).getAsJsonObject();

        Gson gson = new Gson();
        UpdateCustomerRequest customerRequest = gson.fromJson(req, UpdateCustomerRequest.class);
        customerRequest.setId(id);

        // update địa chỉ
        UpdateAddressRequest addressRequest = new UpdateAddressRequest();
        addressRequest.setLine(jsonObject.get("line").getAsString());
        addressRequest.setProvince(jsonObject.get("province").getAsString());
        addressRequest.setDistrict(jsonObject.get("district").getAsString());
        addressRequest.setWard(jsonObject.get("ward").getAsString());
        addressRequest.setToDistrictId(Integer.valueOf(jsonObject.get("toDistrictId").getAsString()));
        addressRequest.setProvinceId(Integer.valueOf(jsonObject.get("provinceId").getAsString()));
        addressRequest.setWardCode(jsonObject.get("wardCode").getAsString());

        addressRequest.setUserId(id);

        return new ResponseObject(customerService.update(customerRequest, addressRequest, file));
    }

    @PostMapping("/quick-create")
    public ResponseObject quickCreate(@RequestParam("request") String req ) {

        JsonObject jsonObject = JsonParser.parseString(req).getAsJsonObject();

        // add khách hàng
        QuickCreateCustomerRequest customerRequest = new QuickCreateCustomerRequest();
        customerRequest.setFullName(jsonObject.get("fullName").getAsString());
        customerRequest.setPhoneNumber(jsonObject.get("phoneNumber").getAsString());
//        customerRequest.setEmail(jsonObject.get("email").getAsString());
        customerRequest.setGender(Boolean.valueOf(jsonObject.get("gender").getAsString()));

        // add địa chỉ
        CreateAddressRequest addressRequest = new CreateAddressRequest();
//        addressRequest.setLine(jsonObject.get("line").getAsString());
//        addressRequest.setProvince(jsonObject.get("province").getAsString());
//        addressRequest.setDistrict(jsonObject.get("district").getAsString());
//        addressRequest.setWard(jsonObject.get("ward").getAsString());
//        addressRequest.setToDistrictId(Integer.valueOf(jsonObject.get("toDistrictId").getAsString()));
//        addressRequest.setProvinceId(Integer.valueOf(jsonObject.get("provinceId").getAsString()));
//        addressRequest.setWardCode(jsonObject.get("wardCode").getAsString());

        return new ResponseObject(customerService.quickCreate(customerRequest, addressRequest));
    }

    @GetMapping("/phone-number/{phoneNumber}")
    public ResponseObject getOneByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
        return new ResponseObject(customerService.getOneByPhoneNumber(phoneNumber));
    }
}
