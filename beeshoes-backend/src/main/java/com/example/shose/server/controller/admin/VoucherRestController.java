package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.voucher.CreateVoucherRequest;
import com.example.shose.server.dto.request.voucher.FindVoucherRequest;
import com.example.shose.server.dto.request.voucher.UpdateVoucherRequest;
import com.example.shose.server.dto.response.voucher.VoucherRespone;
import com.example.shose.server.entity.Voucher;
import com.example.shose.server.infrastructure.common.PageableObject;
import com.example.shose.server.infrastructure.exception.rest.CustomListValidationException;
import com.example.shose.server.infrastructure.exception.rest.ErrorObject;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.example.shose.server.infrastructure.exception.rest.RestExceptionHandler;
import com.example.shose.server.service.VoucherService;
import com.example.shose.server.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/*
 *  @author diemdz
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/voucher")
public class VoucherRestController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping()
    public ResponseObject getAll(@ModelAttribute final FindVoucherRequest findVoucherRequest) {
        return new ResponseObject(voucherService.getAll(findVoucherRequest));

    }

    @GetMapping("/{id}")
    public ResponseObject getById(@PathVariable("id") String id) {
        return new ResponseObject(voucherService.getById(id));
    }

    @PostMapping
    public ResponseObject add(@Valid @RequestBody CreateVoucherRequest request, BindingResult bindingResult) throws Exception {
        if (bindingResult.hasErrors()) {
            throw new CustomListValidationException(404, bindingResult.getAllErrors());
        }
        return new ResponseObject(voucherService.add(request));
    }

    @PostMapping("/expired/{id}")
    public ResponseObject voucherExpired(@PathVariable("id") String id) throws RestApiException {

        return new ResponseObject(voucherService.updateStatus(id));
    }
    @PostMapping("/expired-quantity/{id}")
    public ResponseObject voucherExpiredQuantity(@PathVariable("id") String id) throws RestApiException {

        return new ResponseObject(voucherService.updateStatusQuantity(id));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") String id, @Valid @RequestBody UpdateVoucherRequest request, BindingResult bindingResult) throws CustomListValidationException {
        request.setId(id);
        if (bindingResult.hasErrors()) {
            throw new CustomListValidationException(404, bindingResult.getAllErrors());
        }
        return new ResponseObject(voucherService.update(request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") String id) {
        return new ResponseObject(voucherService.delete(id));
    }

    @GetMapping("/minimum/{minimum}")
    public ResponseObject getVoucherByMinimum(@PathVariable("minimum") int minimum) {
        return new ResponseObject(voucherService.getVoucherByMinimum(minimum));
    }
}
