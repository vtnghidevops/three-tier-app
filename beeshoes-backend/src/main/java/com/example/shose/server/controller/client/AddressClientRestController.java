package com.example.shose.server.controller.client;

import com.example.shose.server.dto.request.address.CreateAddressClientRequest;
import com.example.shose.server.dto.request.address.SetAddressDefaultClientRequest;
import com.example.shose.server.dto.request.address.CreateAddressRequest;
import com.example.shose.server.dto.request.address.UpdateAddressClientRequest;
import com.example.shose.server.dto.request.address.UpdateAddressRequest;
import com.example.shose.server.dto.request.bill.billcustomer.CreateBillCustomerOnlineRequest;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.service.AddressService;
import com.example.shose.server.service.BillService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/address")
public class AddressClientRestController {

    @Autowired
    private AddressService addressService;

    @GetMapping("/{idAccount}")
    public ResponseObject getByAccountAndStatus(@PathVariable("idAccount") String idAccount)  {
        return new ResponseObject(addressService.getAddressByAccountIdAndStatus(idAccount));
    }
    @GetMapping("/list/{idAccount}")
    public ResponseObject getListByAccount(@PathVariable("idAccount") String idAccount)  {
        return new ResponseObject(addressService.getListAddressByAccountId(idAccount));
    }
    @PostMapping("/setDefault")
    public ResponseObject setDefault(@RequestBody SetAddressDefaultClientRequest request)  {
        return new ResponseObject(addressService.setDefault(request));
    }
    @PostMapping("/update")
    public ResponseObject update(@RequestBody UpdateAddressClientRequest request)  {
        return new ResponseObject(addressService.updateAddressClient(request));
    }
    @PostMapping("/create")
    public ResponseObject create(@RequestBody CreateAddressClientRequest request)  {
        return new ResponseObject(addressService.createAddressClient(request));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseObject delete(@PathVariable("id") String idAddress)  {
        return new ResponseObject(addressService.deleteAddressAccount(idAddress));
    }
    @GetMapping("/detail/{id}")
    public ResponseObject detail(@PathVariable("id") String idAddress)  {
        return new ResponseObject(addressService.getOneById(idAddress));
    }

    @GetMapping("/address-user/{idUser}")
    public ResponseObject view(@PathVariable("idUser") String idUser) {
        return new ResponseObject(addressService.findAddressByUserId(idUser));
    }

    @GetMapping("/getOne/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(addressService.getOneById(id));
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateAddressRequest request) {
        return new ResponseObject(addressService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestBody UpdateAddressRequest request) {
        request.setId(id);
        return new ResponseObject(addressService.update(request));
    }

    @GetMapping("/simple-user")
    public ResponseObject getAllSimpleEntityEmployess() {
        return new ResponseObject(addressService.getAllSimpleEntityUser());
    }

    @GetMapping("/address-user-status/{id}")
    public ResponseObject getAddressByUserIdAndStatus(@PathVariable("id") String id) {
        return new ResponseObject(addressService.getAddressByUserIdAndStatus(id, Status.DANG_SU_DUNG));
    }
}
