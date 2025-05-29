package com.example.shose.server.dto.request.brand;

import com.example.shose.server.infrastructure.constant.Status;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Setter
@Getter
public abstract class BaseBrandRequest {

    @NotBlank(message = "Vui lòng không để trống")
    private String name;

    @NotBlank(message = "Vui lòng không để trống")
    private String status;
}
