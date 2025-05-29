package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.color.CreateColorRequest;
import com.example.shose.server.dto.request.color.FindColorRequest;
import com.example.shose.server.dto.request.color.UpdateColorRequest;
import com.example.shose.server.service.ColorService;
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
@RequestMapping("/admin/color")
public class ColorRestController {

    @Autowired
    private ColorService colorService;

    @GetMapping()
    public ResponseObject view(@ModelAttribute final FindColorRequest req) {
        return new ResponseObject(colorService.findAll(req));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(colorService.getOneById(id));
    }

    @GetMapping("/code")
    public ResponseObject getAllCode() {
        return new ResponseObject(colorService.getAllCode());
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateColorRequest req) {
        return new ResponseObject(colorService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestBody UpdateColorRequest req) {
        req.setId(id);
        return new ResponseObject(colorService.update(req));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(colorService.delete(id));
    }
}


