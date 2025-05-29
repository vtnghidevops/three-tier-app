package com.example.shose.server.controller.client;

import com.example.shose.server.dto.request.customer.ChangePasswordRequest;
import com.example.shose.server.infrastructure.exception.rest.CustomListValidationException;
import com.example.shose.server.service.CustomerService;
import com.example.shose.server.service.PromotionService;
import com.example.shose.server.util.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/client/promotion")
public class PromotionClientRestController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping("/ofProductDetail/{id}")
    public ResponseObject getPromotionOfProductDetail(@PathVariable("id")String id)  {
        return new ResponseObject(promotionService.getPromotionOfProductDetail(id));
    }
}
