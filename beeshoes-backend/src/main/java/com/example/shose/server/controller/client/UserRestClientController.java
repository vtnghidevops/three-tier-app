package com.example.shose.server.controller.client;

import com.example.shose.server.infrastructure.session.ShoseSession;
import com.example.shose.server.service.CustomerService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangdt
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/user")
public class UserRestClientController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ShoseSession shoseSession;

    @GetMapping
    public ResponseObject getByEmail()  {
        return new ResponseObject(customerService.findByEmail(shoseSession.getCustomer().getEmail()));
    }
}
