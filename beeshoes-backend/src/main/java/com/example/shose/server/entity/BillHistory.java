package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.StatusBill;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "bill_history")
@AllArgsConstructor
@NoArgsConstructor
public class BillHistory extends PrimaryEntity {

    @Column(name = "action_description")
    private String actionDescription;

    @Enumerated(EnumType.STRING)
    private StatusBill statusBill;

    @ManyToOne
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_employees",referencedColumnName = "id")
    private Account employees;

}
