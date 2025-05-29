package com.example.shose.server.infrastructure.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * @author Nguyễn Vinh
 */
public abstract class ShoseExceptionHandler<T,Z extends Exception> {

    @ExceptionHandler(Exception.class)
    public T handle(Z ex) {
        log(ex);
        return wrap(ex);
    }

    protected abstract T wrap(Z ex);

    private void log(Z ex) {
        System.out.println(ex.getMessage());
    }

}
