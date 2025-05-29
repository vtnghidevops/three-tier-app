package com.example.shose.server.infrastructure.exception.rest;

import com.example.shose.server.infrastructure.exception.ShoseExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * @author Nguyễn Vinh
 */
public abstract class ShoseExceptionRestHandler<Z extends Exception> extends ShoseExceptionHandler<ResponseEntity<?>, Z> {

    @Override
    protected ResponseEntity<?> wrap(Z ex) {
        return new ResponseEntity<>(wrapApi(ex), HttpStatus.BAD_REQUEST);
    }

    protected abstract Object wrapApi(Z ex);
}
