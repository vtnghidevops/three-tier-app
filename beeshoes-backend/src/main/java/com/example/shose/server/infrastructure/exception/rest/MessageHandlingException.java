package com.example.shose.server.infrastructure.exception.rest;

import com.example.shose.server.infrastructure.constant.Message;

/**
 * @author Nguyễn Vinh
 */
public class MessageHandlingException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private String message;

    public MessageHandlingException() {
    }

    public MessageHandlingException(Message statusCode) {
        this.message = statusCode.getMessage();
    }

    public MessageHandlingException(String message) {
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
