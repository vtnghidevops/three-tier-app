package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusMethod;
import com.example.shose.server.infrastructure.constant.StatusPayMents;
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

import java.math.BigDecimal;

/**
 * @author Nguyễn Vinh
 */
@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "payments_method")
@AllArgsConstructor
@NoArgsConstructor
public class PaymentsMethod extends PrimaryEntity {

    @Enumerated(EnumType.STRING)
    private StatusMethod method;

    private String description;

    private String vnp_TransactionNo;

    @Column(name = "transaction_date")
    private Long transactionDate;

    @Column(name = "create_at")
    private Long createAt;

    @Column(name = "total_money")
    private BigDecimal totalMoney;

    @Enumerated(EnumType.STRING)
    private StatusPayMents status;

    @ManyToOne
    @JoinColumn(name = "id_employees",referencedColumnName = "id")
    private Account employees;

    @ManyToOne
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;
}
