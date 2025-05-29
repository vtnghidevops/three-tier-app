package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.category.CreateCategoryRequest;
import com.example.shose.server.dto.request.category.FindCategoryRequest;
import com.example.shose.server.dto.request.category.UpdateCategoryRequest;
import com.example.shose.server.service.CategoryService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/admin/category")
@CrossOrigin("*")
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;


    @GetMapping()
    public ResponseObject getList(final FindCategoryRequest req) {
        return new ResponseObject(categoryService.getList(req));
    }

    @GetMapping("/{id}")
    public ResponseObject getOneById(@PathVariable("id") String id) {
        return new ResponseObject(categoryService.getOneById(id));
    }

    @PostMapping
    public ResponseObject add(@RequestBody CreateCategoryRequest req) {
        return new ResponseObject(categoryService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id,
                                 @RequestBody UpdateCategoryRequest req) {
        req.setId(id);
        return new ResponseObject(categoryService.update(req));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(categoryService.delete(id));
    }

}

