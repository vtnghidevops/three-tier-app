package com.example.shose.server.infrastructure.exception.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Getter
@Setter
@AllArgsConstructor
public class ErrorModel {

    private String fieldError;

    private String message;

}
