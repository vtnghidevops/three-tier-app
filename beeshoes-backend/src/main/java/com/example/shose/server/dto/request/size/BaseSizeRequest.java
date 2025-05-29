package com.example.shose.server.dto.request.size;

import com.example.shose.server.infrastructure.constant.Status;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Setter
@Getter
public abstract class BaseSizeRequest {

    private int name;

    private Status status;
}
