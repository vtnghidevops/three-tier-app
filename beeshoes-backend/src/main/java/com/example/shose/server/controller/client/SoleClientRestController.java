package com.example.shose.server.controller.client;

import com.example.shose.server.service.BrandService;
import com.example.shose.server.service.SoleService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/client/sole")
public class SoleClientRestController {
    @Autowired
    private SoleService soleService;

    @GetMapping("/in-product-detail")
    public ResponseObject getSoleInProductDetail() {
        return new ResponseObject(soleService.getSoleInProductDetail());
    }
}
