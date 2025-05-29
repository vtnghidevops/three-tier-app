package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.Status;
import com.example.shose.server.infrastructure.constant.StatusPromotion;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/*
 *  @author diemdz
 */
@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "promotion_product_detail")
@AllArgsConstructor
@NoArgsConstructor
public class PromotionProductDetail  extends PrimaryEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_promotion",referencedColumnName = "id")
    private Promotion promotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product_detail",referencedColumnName = "id")
    private ProductDetail productDetail;

    @Enumerated(EnumType.STRING)
    private Status status;
}
