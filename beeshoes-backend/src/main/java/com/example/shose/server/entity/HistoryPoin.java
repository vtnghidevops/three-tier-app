package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import com.example.shose.server.infrastructure.constant.TypePoin;
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

@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "history_poin")
@AllArgsConstructor
@NoArgsConstructor
public class HistoryPoin extends PrimaryEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_scoring_formula",referencedColumnName = "id")
    private ScoringFormula scoringFormula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_bill",referencedColumnName = "id")
    private Bill bill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user",referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    private TypePoin typePoin;

    private int value;

}
