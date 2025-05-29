package com.example.shose.server.controller.client;

import com.example.shose.server.service.ColorService;
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
@RequestMapping("/client/color")
public class ColorClientRestController {
    @Autowired
    private ColorService colorService;

    @GetMapping("/in-product-detail")
    public ResponseObject getColorInProductDetail() {
        return new ResponseObject(colorService.getColorInProductDetail());
    }
}
