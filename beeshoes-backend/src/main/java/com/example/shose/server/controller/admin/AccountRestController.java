package com.example.shose.server.controller.admin;

import com.example.shose.server.service.AccountService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Nguyễn Vinh
 */
@RestController
@RequestMapping("/account")
@CrossOrigin("*")
public class AccountRestController {

    

    @Autowired
    private AccountService accountService;

    @GetMapping()
    public ResponseObject getList() {
        return new ResponseObject(accountService.findAll());
    }

    @GetMapping("/get-email")
    public ResponseObject getOneByEmail(@RequestParam("email") String email) {
        return new ResponseObject(accountService.getOneByEmail(email));
    }
    @GetMapping("/simple-employess")
    public ResponseObject getAllSimpleEntityEmployess() {
        return new ResponseObject(accountService.getAllSimpleEntityEmployess());
    }

    @GetMapping("/detail-account/{idBill}")
    public ResponseObject getAccountUserByIdBill(@PathVariable("idBill") String idBill) {
        return new ResponseObject(accountService.getAccountUserByIdBill(idBill));
    }

}
