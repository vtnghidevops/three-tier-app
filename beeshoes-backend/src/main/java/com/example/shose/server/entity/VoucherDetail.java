package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "voucher_detail")
@AllArgsConstructor
@NoArgsConstructor
public class VoucherDetail extends PrimaryEntity {

    @Column(name = "befor_price")
    private BigDecimal beforPrice;

    @Column(name = "after_price")
    private BigDecimal afterPrice;

    @Column(name = "discount_price")
    private BigDecimal discountPrice;

    @ManyToOne
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_voucher",referencedColumnName = "id")
    private Voucher voucher;

}
