package com.example.shose.server.repository;

import com.example.shose.server.dto.response.voucher.VoucherDetailCustomAtCountry;
import com.example.shose.server.entity.VoucherDetail;
import com.example.shose.server.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
/**
 * @author Nguyễn Vinh
 */
@Repository
public interface VoucherDetailRepository extends JpaRepository<VoucherDetail,String> {

    @Modifying
    @Query(value = """
             DELETE FROM  voucher_detail
                   WHERE id_bill = :id
            """, nativeQuery = true)
    int deleteAllByIdBill(@Param("id") String idBill);

    @Query(value = """
          SELECT  vode.id_voucher, vode.after_price, vode.befor_price, vode.discount_price, CONCAT(vo.code , ' - ' , vo.name)  AS name   FROM voucher_detail vode
                           LEFT JOIN bill bi ON bi.id = vode.id_bill
                           LEFT JOIN voucher vo ON vo.id = vode.id_voucher
                           WHERE bi.id  = :id
                           ORDER BY vode.created_date
                           LIMIT 1;
            """, nativeQuery = true)
    VoucherDetailCustomAtCountry getVoucherDetailByIdBill(@Param("id") String idBill);

    @Query(value = """
          SELECT   sum(vode.discount_price)   FROM voucher_detail vode
                           WHERE vode.id_bill  = :id
                           ORDER BY vode.created_date
            """, nativeQuery = true)
    BigDecimal getTotolDiscountBill(@Param("id") String idBill);

    List<VoucherDetail> findAllByBill(Bill bill);

    @Query(value = " SELECT v FROM VoucherDetail  v WHERE v.bill.id = :id")
    VoucherDetail findVoucherDetailByIdBill (@Param("id") String idBill);
}
