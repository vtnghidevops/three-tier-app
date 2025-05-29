package com.example.shose.server.controller.client;

import com.example.shose.server.service.MaterialService;
import com.example.shose.server.service.SizeService;
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
@RequestMapping("/client/size")
public class SizeClientRestController {
    @Autowired
    private SizeService sizeService;
    @GetMapping("/in-product-detail")
    public ResponseObject getSizeInProductDetail() {
        return new ResponseObject(sizeService.getSizeInProductDetail());
    }
}
