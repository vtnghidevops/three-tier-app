package com.example.shose.server.repository;

import com.example.shose.server.entity.ProductDetailGiveBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailGiveBackRepository extends JpaRepository<ProductDetailGiveBack, String> {

    @Query("SELECT p FROM ProductDetailGiveBack p WHERE p.idProductDetail =:idProductDetail")
    ProductDetailGiveBack getOneByIdProductDetail(@Param("idProductDetail")String idProductDetail);
}
