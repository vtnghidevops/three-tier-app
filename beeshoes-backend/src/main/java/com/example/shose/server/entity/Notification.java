package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Nguyễn Vinh
 */
@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "notification")
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends PrimaryEntity {

    @Column(name = "notify_content")
    private String notifyContent;

    private String url;

    private String receiver;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "id_account", referencedColumnName = "id")
    private Account account;

    @OneToOne
    @JoinColumn(name = "id_bill", referencedColumnName = "id")
    private Bill bill;
}
