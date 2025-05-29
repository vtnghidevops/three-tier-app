package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.sole.CreateSoleRequest;
import com.example.shose.server.dto.request.sole.FindSoleRequest;
import com.example.shose.server.dto.request.sole.UpdateSoleRequest;
import com.example.shose.server.service.SoleService;
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
@RequestMapping("/admin/sole")
public class SoleRestController {

    @Autowired
    private SoleService soleService;

    @GetMapping()
    public ResponseObject view(@ModelAttribute final FindSoleRequest req) {
        return new ResponseObject(soleService.findAll(req));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(soleService.getOneById(id));
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateSoleRequest req) {
        return new ResponseObject(soleService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestBody UpdateSoleRequest req) {
        req.setId(id);
        return new ResponseObject(soleService.update(req));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(soleService.delete(id));
    }
}
