package com.example.shose.server.service;

import com.example.shose.server.dto.request.material.CreateMaterialRequest;
import com.example.shose.server.dto.request.material.FindMaterialRequest;
import com.example.shose.server.dto.request.material.UpdateMaterialRequest;
import com.example.shose.server.dto.response.MaterialResponse;
import com.example.shose.server.dto.response.material.GetMaterialInProductDetail;
import com.example.shose.server.entity.Material;
import jakarta.validation.Valid;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
public interface MaterialService {

    List<MaterialResponse> findAll(final FindMaterialRequest req);

    Material create(@Valid final CreateMaterialRequest req);

    Material update(@Valid final UpdateMaterialRequest req);

    Boolean delete(String id);

    Material getOneById(String id);

    List<GetMaterialInProductDetail> getMaterialInProductDetail();

}
