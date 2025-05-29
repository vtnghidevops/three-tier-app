package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.service.HistoryPoinService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author thangdt
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/admin/history-poin")
public class HistoryPoinRestController {

    @Autowired
    private HistoryPoinService historyPoinService;

    @GetMapping("/user/{idUser}")
    public ResponseObject view(@PathVariable("idUser") String idUser) {
        return new ResponseObject(historyPoinService.getAllHisToryPoinByIdUser(idUser));
    }
}
