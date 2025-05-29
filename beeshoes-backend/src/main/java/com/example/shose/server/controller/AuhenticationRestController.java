package com.example.shose.server.controller;

import com.example.shose.server.dto.logindto.ChangePassword;
import com.example.shose.server.dto.logindto.ResetPassword;
import com.example.shose.server.infrastructure.exception.rest.CustomListValidationException;
import com.example.shose.server.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.example.shose.server.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.example.shose.server.infrastructure.sercurity.auth.SignUpRequets;
import com.example.shose.server.infrastructure.sercurity.auth.SigninRequest;
import com.example.shose.server.service.AuthenticationService;
import com.example.shose.server.util.ResponseObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login-v2")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuhenticationRestController {


    private final AuthenticationService authenticationService;

    @PostMapping("/singup")
    public String singup (@Valid  @RequestBody SignUpRequets requets, BindingResult bindingResult) throws CustomListValidationException {
        if(bindingResult.hasErrors()){
            throw new CustomListValidationException(404,bindingResult.getAllErrors());
        }
        return authenticationService.signUp(requets);
    }

    @PostMapping("/singin")
    public ResponseEntity<JwtAuhenticationResponse> singin (@RequestBody SigninRequest requets)  {
        return ResponseEntity.ok(authenticationService.singIn(requets));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuhenticationResponse> refreshToken (@RequestBody RefreshTokenRequets requets){
        return ResponseEntity.ok(authenticationService.refreshToken(requets));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword (@RequestBody ResetPassword resetPassword){
        return ResponseEntity.ok(authenticationService.resetPassword(resetPassword));
    }

    @PostMapping("/change-password")
    public ResponseObject changePassword (@RequestBody ChangePassword changePassword){
        return new ResponseObject(authenticationService.changePassword(changePassword));
    }


}
