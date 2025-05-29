package com.example.shose.server.service.impl;

import com.example.shose.server.dto.request.category.CreateCategoryRequest;
import com.example.shose.server.dto.request.category.FindCategoryRequest;
import com.example.shose.server.dto.request.category.UpdateCategoryRequest;
import com.example.shose.server.dto.response.CategoryResponse;
import com.example.shose.server.dto.response.category.GetCategoryInProductDetail;
import com.example.shose.server.entity.Category;
import com.example.shose.server.infrastructure.common.PageableObject;
import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.repository.CategoryRepository;
import com.example.shose.server.service.CategoryService;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;

/**
 * @author Nguyễn Vinh
 */
@Service
@Validated
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<CategoryResponse> getList(FindCategoryRequest req) {
        return categoryRepository.getAll(req);
    }

    @Override
    public Category create( @Valid CreateCategoryRequest req) {
        Category checkName = categoryRepository.getOneByName(req.getName());
        if (checkName != null) {
            throw new RestApiException(Message.NAME_EXISTS);
        }
        Category add = new Category();
        add.setName(req.getName());
        add.setStatus(Status.valueOf(req.getStatus()));
        return categoryRepository.save(add);
    }

    @Override
    public Category update(@Valid UpdateCategoryRequest req) {
        Optional<Category> optional = categoryRepository.findById(req.getId());
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        Category existence = categoryRepository.getByNameExistence(req.getName(),req.getId());
        if(existence != null){
            throw new RestApiException(Message.NAME_EXISTS);
        }
        Category update = optional.get();
        update.setName(req.getName());
        update.setStatus(Status.valueOf(req.getStatus()));
        return categoryRepository.save(update);
    }

    @Override
    public Boolean delete(String id) {
        Optional<Category> optional = categoryRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        categoryRepository.delete(optional.get());
        return true;
    }

    @Override
    public Category getOneById(String id) {
        Optional<Category> optional = categoryRepository.findById(id);
        if (!optional.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return optional.get();
    }

    @Override
    public List<GetCategoryInProductDetail> getCategoryInProductDetail() {
        return categoryRepository.getCategoryInProductDetail();
    }
}
