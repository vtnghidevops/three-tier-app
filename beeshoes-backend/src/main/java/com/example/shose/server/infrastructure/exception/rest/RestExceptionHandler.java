package com.example.shose.server.infrastructure.exception.rest;

import com.example.shose.server.util.ResponseObject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Nguyễn Vinh
 */
@RestControllerAdvice
public final class RestExceptionHandler extends
        ShoseExceptionRestHandler<ConstraintViolationException> {

    private SimpMessagingTemplate simpMessagingTemplate;

    @ExceptionHandler(RestApiException.class)
    public ResponseEntity<?> handlerException(RestApiException restApiException) {
        ApiError apiError = new ApiError(restApiException.getMessage());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected Object wrapApi(ConstraintViolationException ex) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        List<ErrorModel> errors = violations.stream()
                .map(violation ->
                        new ErrorModel(getPropertyName(violation.getPropertyPath()), violation.getMessage()))
                .collect(Collectors.toList());
        return errors;
    }

    @MessageExceptionHandler(MessageHandlingException.class)
    public void handleMessageException(MessageHandlingException ex, @Header("simpSessionId") String sessionId) {
        ErrorObject errorObject = new ErrorObject(ex.getMessage());
        simpMessagingTemplate.convertAndSend("/portal-projects/error/" + sessionId, errorObject);
    }

    @MessageExceptionHandler
    public void handleException(Exception ex, @Header("simpSessionId") String sessionId) {
        if (ex instanceof ConstraintViolationException) {
            log(ex);
            ConstraintViolationException cve = (ConstraintViolationException) ex;
            Set<ConstraintViolation<?>> violations = cve.getConstraintViolations();
            List<ErrorModel> errors = violations.stream()
                    .map(violation -> new ErrorModel(getPropertyName(violation.getPropertyPath()), violation.getMessage()))
                    .collect(Collectors.toList());
            simpMessagingTemplate.convertAndSend("/portal-projects/error/" + sessionId, errors);
        }
    }

    private String getPropertyName(Path path) {
        String pathStr = path.toString();
        String[] comps = pathStr.split("\\.");
        if (comps.length > 0) {
            return comps[comps.length - 1];
        } else {
            return pathStr;
        }
    }

    private void log(Exception ex) {
        System.out.println(ex.getMessage());
    }

    @ExceptionHandler({CustomListValidationException.class})
    public ResponseEntity<Object> handleValidationException(
            CustomListValidationException ex) {
        List<String> errors = new ArrayList<>();
        ex.getErrors().forEach((error) -> {
            String errorMessage = error.getDefaultMessage();
            errors.add(errorMessage);
        });

        return new ResponseEntity<>(
                new ResponseObject(false, "Thất bại", errors), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
}

