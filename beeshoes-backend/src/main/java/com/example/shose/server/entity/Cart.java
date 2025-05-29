package com.example.shose.server.entity;

import com.example.shose.server.entity.base.PrimaryEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor
public class Cart extends PrimaryEntity {

    @OneToOne
    @JoinColumn(name = "id_account",referencedColumnName = "id")
    private Account account;

}
