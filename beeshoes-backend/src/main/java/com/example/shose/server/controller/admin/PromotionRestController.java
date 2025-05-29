package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.promotion.CreatePromotionRequest;
import com.example.shose.server.dto.request.promotion.FindPromotionRequest;
import com.example.shose.server.dto.request.promotion.UpdatePromotionRequest;
import com.example.shose.server.infrastructure.exception.rest.CustomListValidationException;
import com.example.shose.server.service.PromotionService;
import com.example.shose.server.util.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/promotion")
public class PromotionRestController {
    @Autowired
    private PromotionService promotionService;

    @GetMapping()
    public ResponseObject getAll(@ModelAttribute final FindPromotionRequest findPromotionRequest) {
        return new ResponseObject(promotionService.getAll(findPromotionRequest));
    }


    @PostMapping
    public ResponseObject add(@Valid @RequestBody CreatePromotionRequest request, BindingResult bindingResult) throws Exception {
        if(bindingResult.hasErrors()){
            throw new CustomListValidationException(404,bindingResult.getAllErrors());
        }
        return new ResponseObject(promotionService.add(request));
    }
    @PostMapping("/expired/{id}")
    public ResponseObject promotionExpired(@PathVariable("id") String id) {

        return new ResponseObject(promotionService.updateStatus(id));
    }
    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id, @RequestBody UpdatePromotionRequest request) {
        request.setId(id);
        return new ResponseObject(promotionService.update(request));
    }
    @GetMapping("/{id}")
    public ResponseObject getByIdPromotion(@PathVariable("id") String id) {
        return new ResponseObject(promotionService.getByIdPromotion(id));
    }
    @GetMapping("/byProductDetail/{id}")
    public ResponseObject getByIdProductDetail(@PathVariable("id") String id) {
        return new ResponseObject(promotionService.getByIdProductDetail(id));
    }
}
