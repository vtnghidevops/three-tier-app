package com.example.shose.server.controller.admin;

import com.example.shose.server.infrastructure.poin.ConfigPoin;
import com.example.shose.server.util.ResponseObject;
import com.example.shose.server.util.payMent.Config;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangdt
 */
@RestController
@RequestMapping("/admin/poin")
@RequiredArgsConstructor
public class PoinResController {

    @Autowired
    private  ConfigPoin configPoin;
    @GetMapping
    public ResponseObject detail(){
        return new ResponseObject(configPoin.readJsonFile());
    }
}
