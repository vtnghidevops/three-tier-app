package com.example.shose.server.infrastructure.listener;

import com.example.shose.server.entity.base.PrimaryEntity;
import jakarta.persistence.PrePersist;

import java.util.UUID;

/**
 * @author Nguyễn Vinh
 */
public class CreatePrimaryEntityListener {

    @PrePersist
    private void onCreate(PrimaryEntity entity) {
        entity.setId(UUID.randomUUID().toString());
    }
}
