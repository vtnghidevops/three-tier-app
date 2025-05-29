package com.example.shose.server.entity.base;

import com.example.shose.server.infrastructure.listener.AuditEntityListener;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyễn Vinh
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditEntityListener.class)
public abstract class AuditEntity {

    @Column(updatable = false)
    private Long createdDate;

    @Column
    private Long lastModifiedDate;

    @Column(updatable = false)
    private String createdBy;

    @Column
    private String updatedBy;

}
