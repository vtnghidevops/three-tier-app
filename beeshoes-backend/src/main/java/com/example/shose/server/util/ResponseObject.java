package com.example.shose.server.util;

import com.example.shose.server.infrastructure.common.PageableObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

/**
 * @author Nguyễn Vinh
 */
@Getter
@Setter
@AllArgsConstructor
public class ResponseObject {

    private boolean isSuccess = false;
    private String message;
    private Object data;




    public <T> ResponseObject(T obj) {
        processReponseObject(obj);
    }
    public <T> ResponseObject(Page<T> page) {
        this.setSuccess(true);
        this.setMessage("Thành công");
        this.data = new PageableObject<T>(page);

    }
    public void processReponseObject(Object obj) {
        if (obj != null) {
            this.message = "Thành công";
            this.isSuccess = true;
            this.data = obj;
        }
    }
}