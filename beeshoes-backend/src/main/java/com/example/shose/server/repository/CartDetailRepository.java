package com.example.shose.server.repository;

import com.example.shose.server.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail,String> {

    List<CartDetail> getCartDetailByCart_Id(String idCart);

    List<CartDetail> getCartDetailByCart_IdAndProductDetail_Id(String idCart,String idProductDeatail);
    @Modifying
    @Transactional
    @Query(value = """
            delete c from cart_detail c
            join  cart c2 on c.id_cart = c2.id
            join account a on c2.id_account = a.id
            where a.id = :idAccount
            """,nativeQuery = true)
    void deleteAllCart(@Param("idAccount") String idAccount);
}
