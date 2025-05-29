package com.example.shose.server.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Nguyễn Vinh
 */
@Slf4j
public class FormUtils {

    private static final ObjectMapper MAPPER = new ObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

    public <T> T convertToObject(Class<T> clazz, Object data) {
        Gson gson = new Gson();
        try {
            return MAPPER.readValue(gson.toJson(data), clazz);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
