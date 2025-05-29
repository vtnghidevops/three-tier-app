package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.size.CreateSizeRequest;
import com.example.shose.server.dto.request.size.FindSizeRequest;
import com.example.shose.server.dto.request.size.UpdateSizeRequest;
import com.example.shose.server.service.SizeService;
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
@RequestMapping("/admin/size")
public class SizeRestController {

    @Autowired
    private SizeService sizeService;


    @GetMapping()
    public ResponseObject view(@ModelAttribute final FindSizeRequest req) {
        return new ResponseObject(sizeService.findAll(req));
    }

    @GetMapping("/list")
    public ResponseObject getAll() {
        return new ResponseObject(sizeService.getAll());
    }

    @GetMapping("/name/{name}")
    public ResponseObject getOneByName(@PathVariable("name") int name) {
        return new ResponseObject(sizeService.getOneByName(name));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(sizeService.getOneById(id));
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateSizeRequest req) {
        return new ResponseObject(sizeService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id, @RequestBody UpdateSizeRequest req) {
        req.setId(id);
        return new ResponseObject(sizeService.update(req));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(sizeService.delete(id));
    }
}
