package com.example.shose.server.repository;

import com.example.shose.server.dto.request.voucher.FindVoucherRequest;
import com.example.shose.server.dto.response.voucher.VoucherRespone;
import com.example.shose.server.entity.Promotion;
import com.example.shose.server.entity.Voucher;
import com.example.shose.server.infrastructure.constant.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    @Query(value = """ 
            select 
            vo.id as id,
            vo.code as code,
            vo.name as name,
            vo.value as value,
            vo.minimum_bill as minimumBill,
            vo.quantity as quantity,
            vo.start_date as startDate,
            vo.end_date as endDate,
            vo.status as status,
            vo.created_date AS createdDate,
            vo.last_modified_date AS lastModifiedDate
                       
            from voucher vo 
            where
                        
                (:#{#req.code} IS NULL 
                or :#{#req.code} LIKE '' 
                or vo.code like  %:#{#req.code}%)
            and 
                (:#{#req.name} IS NULL 
                or :#{#req.name} LIKE '' 
                or vo.name like %:#{#req.name}% )
            and 
                (:#{#req.value} IS NULL 
                or :#{#req.value} LIKE '' 
                or vo.value = :#{#req.value})
            and
                (:#{#req.quantity} IS NULL 
                or :#{#req.quantity} LIKE ''
                or vo.quantity = :#{#req.quantity})
            and 
                (:#{#req.status} IS NULL 
                or :#{#req.status} LIKE ''
                or vo.status = :#{#req.status} )
            and (
                (:#{#req.startDate} IS NULL 
                or :#{#req.startDate} LIKE ''
                or :#{#req.endDate} IS NULL 
                or :#{#req.endDate} LIKE '')           
                or((vo.start_date>= :#{#req.startDate} and  vo.start_date<= :#{#req.endDate}) and(vo.end_date>= :#{#req.startDate} and vo.end_date<= :#{#req.endDate} )) )
            GROUP BY vo.id
            ORDER BY vo.last_modified_date DESC  
            """,
            nativeQuery = true)
    List<VoucherRespone> getAllVoucher(@Param("req") FindVoucherRequest req);

    @Query(value = """ 
            select 
            vo.id as id,
            vo.code as code,
            vo.name as name,
            vo.value as value,
            vo.quantity as quantity,
            vo.start_date as startDate,
            vo.end_date as endDate,
            vo.status as status,
            vo.created_date AS createdDate,
            vo.last_modified_date AS lastModifiedDate
                       
            from voucher vo 
            """,
            nativeQuery = true)
    List<VoucherRespone> getAllVoucherWs();

    @Query("SELECT vo FROM Voucher vo WHERE vo.code like :code")
    Voucher getByCode(@Param("code") String code);

    @Query("SELECT vo FROM Voucher vo WHERE vo.endDate < :currentDate")
    List<Voucher> findExpiredVouchers(@Param("currentDate") Long currentDate);

    @Query("SELECT vo FROM Voucher vo WHERE vo.startDate = :currentDate")
    List<Voucher> findStartVouchers(@Param("currentDate") Long currentDate);

    @Query("select vc from Voucher vc" +
            " WHERE vc.quantity >= 1 and vc.status = 'DANG_SU_DUNG'")
    List<Voucher> getAllHaveQuantity();

    List<Voucher> findAllByStatus(Status status);

    Optional<Voucher> findByName(String name);

    Optional<Voucher> findByCode(String code);

    @Query(value = """
            SELECT
                vo.id as id,
                vo.code as code,
                vo.name as name,
                vo.value as value,
                vo.minimum_bill as minimumBill,
                vo.quantity as quantity,
                vo.start_date as startDate,
                vo.end_date as endDate,
                vo.status as status,
                vo.created_date AS createdDate,
                vo.last_modified_date AS lastModifiedDate
            FROM voucher vo
            WHERE vo.status = 'DANG_SU_DUNG' AND vo.minimum_bill <= :minimum
            ORDER BY vo.minimum_bill DESC
            LIMIT 1
             """, nativeQuery = true)
    VoucherRespone getVoucherByMinimum(@Param("minimum") int minimum);
}
