package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.material.CreateMaterialRequest;
import com.example.shose.server.dto.request.material.FindMaterialRequest;
import com.example.shose.server.dto.request.material.UpdateMaterialRequest;
import com.example.shose.server.service.MaterialService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Nguyễn Vinh
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/material")
public class MaterialRestController {

    @Autowired
    private MaterialService materialService;

    @GetMapping()
    public ResponseObject view(@ModelAttribute final FindMaterialRequest req) {
        return new ResponseObject(materialService.findAll(req));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(materialService.getOneById(id));
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateMaterialRequest req) {
        return new ResponseObject(materialService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestBody UpdateMaterialRequest req) {
        req.setId(id);
        return new ResponseObject(materialService.update(req));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(materialService.delete(id));
    }
}
