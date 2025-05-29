package com.example.shose.server.infrastructure.exception.rest;

import com.example.shose.server.infrastructure.constant.Message;

/**
 * @author Nguyễn Vinh
 */
public class RestApiException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private String message;

    public RestApiException() {
    }

    public RestApiException(Message statusCode) {
        this.message = statusCode.getMessage();
    }

    public RestApiException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
