package com.example.shose.server.controller.admin;

import com.example.shose.server.dto.request.ScoringFormulaRequest;
import com.example.shose.server.service.ScoringFormulaService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/scoring-formula")
public class ScoringFormulaRestController {

    @Autowired
    private ScoringFormulaService scoringFormulaService;

    @PostMapping
    public ResponseObject addOrUpdate (@RequestBody ScoringFormulaRequest request){
        return new ResponseObject(scoringFormulaService.add(request));
    }
}
