package com.example.shose.server.controller.admin;

import com.example.shose.server.service.ImagesService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/image")
public class ImagesRestController {

    @Autowired
    private ImagesService imagesService;

    @GetMapping("/{idProductdetail}")
    public ResponseObject view(@PathVariable("idProductdetail") String idProductdetail) {
        return new ResponseObject(imagesService.findAllByIdProductDetail(idProductdetail));
    }
}
