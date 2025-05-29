package com.example.shose.server.infrastructure.poin;

import com.example.shose.server.infrastructure.constant.Message;
import com.example.shose.server.infrastructure.exception.rest.RestApiException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.nio.charset.StandardCharsets;

/**
 * @author thangdt
 */
@Component
public class ConfigPoin {

    @Autowired
   private  ResourceLoader resourceLoader;

    public  Poin readJsonFile() {
          try {
              ClassPathResource classPathResource = new ClassPathResource("config/" + "poin.json");

              byte[] byteArray = FileCopyUtils.copyToByteArray(classPathResource.getInputStream());
              String jsonContent = new String(byteArray, StandardCharsets.UTF_8);

              ObjectMapper objectMapper = new ObjectMapper();
              return objectMapper.readValue(jsonContent, Poin.class);
          }catch (Exception e){
              throw new RestApiException(Message.NOT_EXISTS);
          }
    }

    public Poin writeJsonFile(Poin poin) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            ClassPathResource classPathResource = new ClassPathResource("config/" + "poin.json");
            objectMapper.writeValue(new File(classPathResource.getPath()), poin);
        }catch (Exception e){
            throw new RestApiException(Message.NOT_EXISTS);
        }
        return poin;
    }

}
