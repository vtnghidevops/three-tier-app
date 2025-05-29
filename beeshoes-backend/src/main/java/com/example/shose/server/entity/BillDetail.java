package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.StatusBill;
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
@Table(name = "bill_detail")
@AllArgsConstructor
@NoArgsConstructor
public class BillDetail extends PrimaryEntity {

    private Integer quantity;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private StatusBill statusBill ;

    private BigDecimal promotion;

    @ManyToOne
    @JoinColumn(name = "id_product_detail")
    private ProductDetail productDetail;

    @ManyToOne
    @JoinColumn(name = "id_bill")
    private Bill bill;
}
