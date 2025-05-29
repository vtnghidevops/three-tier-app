package com.example.shose.server.repository;

import com.example.shose.server.entity.Bill;
import com.example.shose.server.entity.PaymentsMethod;
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
public interface PaymentsMethodRepository extends JpaRepository<PaymentsMethod, String> {

    List<PaymentsMethod> findAllByBill(Bill bill);

    @Query(value = """
            SELECT 
            COALESCE(SUM(total_money), 0)
             FROM payments_method
             WHERE id_bill = :idBill
            """, nativeQuery = true)
    BigDecimal sumTotalMoneyByIdBill(String idBill);

    @Modifying
    @Query(value = """
             DELETE FROM  payments_method
             WHERE id_bill = :id AND method NOT IN ('CHUYEN_KHOAN')
            """, nativeQuery = true)
    int deleteAllByIdBill(@Param("id") String idBill);


    @Query(value = """
             SELECT COUNT(id) FROM payments_method
             WHERE id_bill = :idBill
             AND status = 'TRA_SAU'
            """, nativeQuery = true)
    int countPayMentPostpaidByIdBill(@Param("idBill") String idBill);

    @Modifying
    @Query(value = """
                    UPDATE payments_method pa
                    SET pa.status = 'THANH_TOAN'
                    WHERE pa.id_bill = :idBill
                    """, nativeQuery = true)
    void updateAllByIdBill(@Param("idBill") String idBill);

    @Query(value = """
                    SELECT id FROM payments_method
                    WHERE vnp_transaction_no = :code
                    """, nativeQuery = true)
    List<String> findAllByVnpTransactionNo(@Param("code") String code);

    @Query(value = """
                    SELECT id  FROM payments_method
                    WHERE id_bill = :idBill
                    AND method = 'TIEN_MAT' 
                    AND status = 'TRA_SAU' 
                    """, nativeQuery = true)
    List<String> findAllPayMentByIdBillAndMethod(@Param("idBill") String idBill);

    @Query(value = """
                    SELECT sum(total_money)  FROM payments_method
                    WHERE id_bill = :idBill
                    """, nativeQuery = true)
    BigDecimal findTotalPayMnetByIdBill(@Param("idBill") String idBill);

    @Query(value = """
                    SELECT * FROM payments_method
                    WHERE id_bill = :idBill
                    """, nativeQuery = true)

    PaymentsMethod findByBill(@Param("idBill") String idBill);

}
