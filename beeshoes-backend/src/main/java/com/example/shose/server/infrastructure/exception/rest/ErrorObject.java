package com.example.shose.server.infrastructure.exception.rest;

/**
 * @author Nguyễn Vinh
 */
public class ErrorObject {

    private String errorMessage;

    public ErrorObject(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
