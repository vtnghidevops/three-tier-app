package com.example.shose.server.repository;

import com.example.shose.server.dto.request.bill.FindNewBillCreateAtCounterRequest;
import com.example.shose.server.dto.request.bill.StatusRequest;
import com.example.shose.server.dto.request.statistical.FindBillDateRequest;
import com.example.shose.server.dto.response.bill.BillAccountResponse;
import com.example.shose.server.dto.response.bill.BillGiveBack;
import com.example.shose.server.dto.response.bill.BillGiveBackInformation;

import com.example.shose.server.dto.response.bill.BillResponseAtCounter;
import com.example.shose.server.dto.response.bill.ListStatusRespone;
import com.example.shose.server.dto.response.statistical.StatisticalBestSellingProductResponse;
import com.example.shose.server.dto.response.statistical.StatisticalBillDateResponse;
import com.example.shose.server.dto.response.statistical.StatisticalDayResponse;
import com.example.shose.server.dto.response.statistical.StatisticalMonthlyResponse;
import com.example.shose.server.dto.response.statistical.StatisticalProductDateResponse;
import com.example.shose.server.dto.response.statistical.StatisticalStatusBillResponse;
import com.example.shose.server.entity.Bill;
import com.example.shose.server.dto.request.bill.BillRequest;
import com.example.shose.server.dto.response.bill.BillResponse;
import com.example.shose.server.dto.response.bill.UserBillResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface BillRepository extends JpaRepository<Bill, String> {


    @Query(value = """
               SELECT  ROW_NUMBER() OVER( ORDER BY bi.last_modified_date DESC ) AS stt, bi.id, 
               bi.code, bi.created_date, bi.user_name AS userName ,  usem.full_name AS nameEmployees , bi.type, bi.status_bill,
               bi.last_modified_date AS lastModifiedDate ,
               bi.note AS note,
               CASE
               WHEN total_money + money_ship - item_discount < 0 THEN 0
               ELSE total_money + money_ship - item_discount
               END  AS total_money
               , bi.item_discount  FROM bill bi
               LEFT JOIN account ac ON ac.id = bi.id_account
               LEFT JOIN account em ON em.id = bi.id_employees
               LEFT JOIN customer cu ON cu.id = bi.id_customer
               LEFT JOIN user usac ON usac.id = ac.id_user
               LEFT JOIN user usem ON usem.id = em.id_user
               WHERE  ( :#{#request.startTime} = 0
                        OR bi.created_date >= :#{#request.startTime}  )
               AND ( :#{#request.endTime} = 0
                        OR bi.created_date <= :#{#request.endTime}  )
                AND ( :#{#request.startDeliveryDate} = 0
                        OR bi.delivery_date >= :#{#request.startDeliveryDate}  )
               AND ( :#{#request.endDeliveryDate} = 0
                        OR bi.delivery_date <= :#{#request.endDeliveryDate}  )
               AND ( :#{#request.converStatus} IS NULL
                        OR :#{#request.converStatus} LIKE '[]'
                        OR bi.status_bill IN (:#{#request.status}))
               AND ( :#{#request.key} IS NULL
                        OR :#{#request.key} LIKE ''
                        OR bi.code LIKE %:#{#request.key}%
                        OR bi.user_name LIKE %:#{#request.key}%
                        OR usem.full_name LIKE %:#{#request.key}%
                        OR bi.phone_number LIKE %:#{#request.key}% )
               AND ( :#{#request.type} IS NULL
                        OR :#{#request.type} LIKE ''
                        OR bi.type = :#{#request.type})
              AND ( :role = 'ROLE_ADMIN' OR 'CHO_XAC_NHAN' IN (:#{#request.status}) OR bi.id_employees = :id )
               ORDER BY bi.last_modified_date DESC
            """, nativeQuery = true)
    List<BillResponse> getAll(@Param("id") String id, @Param("role") String role, BillRequest request);

    @Query(value = """
             SELECT  ROW_NUMBER() OVER( ORDER BY bi.created_date DESC ) AS stt, bi.id, bi.code, bi.created_date, IF(usac.full_name IS NULL, cu.full_name, usac.full_name )  AS userName ,   bi.status_bill, bi.total_money, bi.item_discount, COUNT(bide.quantity) AS quantity FROM bill bi
                         LEFT JOIN account ac ON ac.id = bi.id_account
                         LEFT JOIN bill_detail bide ON bide.id_bill = bi.id
                         LEFT JOIN account em ON em.id = bi.id_employees
                         LEFT JOIN customer cu ON cu.id = bi.id_customer
                         LEFT JOIN user usac ON usac.id = ac.id_user
                         LEFT JOIN user usem ON usem.id = em.id_user
             WHERE bi.type = 'OFFLINE'
             AND bi.status_bill = 'TAO_HOA_DON'
             AND ( :#{#request.key} IS NULL
                      OR :#{#request.key} LIKE ''
                      OR bi.user_name LIKE :#{#request.key}
                      OR bi.code LIKE :#{#request.key}
                      OR bi.phone_number LIKE :#{#request.key})
            AND  bi.id_employees = :id
            GROUP BY   bi.id, bi.code, bi.created_date, IF(usac.full_name IS NULL, cu.full_name, usac.full_name ) ,   bi.status_bill, bi.total_money, bi.item_discount
             ORDER BY bi.created_date ASC
             """, nativeQuery = true)
    List<BillResponseAtCounter> findAllBillAtCounterAndStatusNewBill(@Param("id") String id,
            FindNewBillCreateAtCounterRequest request);

    @Query(value = """
            SELECT  ROW_NUMBER() OVER( ORDER BY bi.created_date ASC ) AS stt, 
            IF(bi.id_account IS NULL, cu.id, usac.id )  AS id ,  
            IF(usac.full_name IS NULL, cu.full_name, usac.full_name )  AS userName   FROM bill bi
                         LEFT JOIN account ac ON ac.id = bi.id_account
                         LEFT JOIN customer cu ON cu.id = bi.id_customer
                         LEFT JOIN user usac ON usac.id = ac.id_user
                         ORDER BY bi.created_date
            """, nativeQuery = true)
    List<UserBillResponse> getAllUserInBill();

    @Query(value = """
            SELECT status_bill, COUNT(id) AS quantity FROM bill
            GROUP BY status_bill
            """, nativeQuery = true)
    List<ListStatusRespone> getAllSatusBill();

    @Query(value = """
            SELECT bi.id FROM bill bi
            LEFT JOIN bill_detail bide ON bide.id_bill = bi.id
            GROUP BY bi.id
            HAVING COUNT(bide.id) = 0
            """, nativeQuery = true)
    List<String> getAllBillTrash();

    @Query(value = """
            SELECT
              COUNT(DISTINCT b.id) AS totalBill,
              SUM(b.total_money) AS totalBillAmount,
              COALESCE(SUM(bd.quantity), 0) AS totalProduct
            FROM
              bill b
            LEFT JOIN (
              SELECT id_bill, SUM(quantity) AS quantity
              FROM bill_detail
              GROUP BY id_bill
            ) bd ON b.id = bd.id_bill
            WHERE
            b.completion_date >= :startOfMonth AND b.completion_date <= :endOfMonth
            AND b.status_bill IN ('THANH_CONG', 'TRA_HANG')
              """, nativeQuery = true)
    List<StatisticalMonthlyResponse> getAllStatisticalMonthly(@Param("startOfMonth") Long startOfMonth,
            @Param("endOfMonth") Long endOfMonth);

    @Query(value = """
            SELECT
                COUNT(DISTINCT b.id) AS totalBillToday,
                SUM(b.total_money) AS totalBillAmountToday
            FROM bill b 
            WHERE
            b.completion_date >= :startOfDay AND b.completion_date <= :endOfDay
            AND b.status_bill IN ('THANH_CONG', 'TRA_HANG')                       
                          """, nativeQuery = true)
    List<StatisticalDayResponse> getAllStatisticalDay(@Param("startOfDay") Long startOfDay, @Param("endOfDay") Long endOfDay);

    @Query(value = """
            SELECT
                status_bill AS statusBill,
                COUNT(*) AS totalStatusBill
            FROM
                bill
            WHERE       
               created_date >= :#{#req.startDate} AND created_date <= :#{#req.endDate}
            GROUP BY
                statusBill;
                            """, nativeQuery = true)
    List<StatisticalStatusBillResponse> getAllStatisticalStatusBill(@Param("req") FindBillDateRequest req);

    @Query(value = """
   SELECT
       i.name AS image,
       p.name  AS nameProduct,
       pd.price AS price,
       SUM(bd.quantity) AS sold,
       SUM(bd.price) AS sales
   FROM bill_detail bd
            JOIN bill b on bd.id_bill = b.id
            JOIN product_detail pd on pd.id = bd.id_product_detail
            JOIN product p on pd.id_product = p.id
            JOIN (SELECT id_product_detail, MAX(id) AS max_image_id
                  FROM image
                  GROUP BY id_product_detail) max_images ON pd.id = max_images.id_product_detail
            LEFT JOIN image i ON max_images.max_image_id = i.id
   WHERE bd.id_product_detail IS NOT NULL 
        AND b.status_bill IN ('THANH_CONG', 'TRA_HANG')
        AND b.completion_date >= :#{#req.startDate} AND b.completion_date <= :#{#req.endDate}
   GROUP BY image, nameProduct, price
   ORDER BY sold desc
   LIMIT 9
                                      """, nativeQuery = true)
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(@Param("req") FindBillDateRequest req);

    @Query(value = """
            SELECT
                completion_date AS billDate,
                COUNT(*) AS totalBillDate
            FROM
                bill
            WHERE   (completion_date >= :#{#req.startDate} AND completion_date <= :#{#req.endDate} )
                AND (status_bill IN ('THANH_CONG', 'TRA_HANG'))
            GROUP BY billDate
            ORDER BY completion_date ASC;
                                  """, nativeQuery = true)
    List<StatisticalBillDateResponse> getAllStatisticalBillDate(@Param("req") FindBillDateRequest req);

    @Query(value = """
            SELECT
                 b.completion_date AS billDate,
                 SUM(bd.quantity) AS totalProductDate
            FROM
                 bill_detail bd
            JOIN bill b on bd.id_bill = b.id
            WHERE   (b.completion_date >= :#{#req.startDate} AND b.completion_date <= :#{#req.endDate} )
                AND (b.status_bill IN ('THANH_CONG', 'TRA_HANG'))
            GROUP BY billDate
            ORDER BY b.completion_date ASC;
                                  """, nativeQuery = true)
    List<StatisticalProductDateResponse> getAllStatisticalProductDate(@Param("req") FindBillDateRequest req);

    Optional<Bill> findByCode(String code);

    Optional<Bill> findByCodeAndPhoneNumber(String code, String phoneNumber);

    @Query(value = """

     SELECT   bi.id as id,
              bi.total_money as totalMoney,
              bi.status_bill as statusBill,
              (select group_concat(bd.id)  from bill_detail bd where bd.id_bill = bi.id) as billDetail
     FROM bill bi
               JOIN account ac ON ac.id = bi.id_account
                WHERE ac.id = :#{#req.id}   
                AND ( :#{#req.status}  IS NULL
                         OR :#{#req.status} LIKE ''
                         OR bi.status_bill Like (:#{#req.status}))
                ORDER BY bi.last_modified_date DESC
                """, nativeQuery = true)
    List<BillAccountResponse> getBillAccount(StatusRequest req);

    @Query(value = """
       SELECT
           i.name AS image,
           p.name  AS nameProduct,
           pd.price AS price,
           pd.quantity AS sold,
           pd.quantity AS sales
       FROM product_detail pd
                JOIN product p on pd.id_product = p.id
                JOIN (SELECT id_product_detail, MAX(id) AS max_image_id
                      FROM image
                      GROUP BY id_product_detail) max_images ON pd.id = max_images.id_product_detail
                LEFT JOIN image i ON max_images.max_image_id = i.id
       WHERE pd.quantity < 10
       ORDER BY sold asc
                                      """, nativeQuery = true)
    List<StatisticalBestSellingProductResponse> getAllStatisticalProductStock();

    @Query(value = """
            SELECT
                bi.id AS idBill,
                bi.code AS codeBill,
                bi.user_name AS nameCustomer,
                bi.phone_number AS phoneNumber,
                bi.status_bill AS statusBill,
                bi.type AS typeBill,
                bi.address AS address,
                bi.note AS note,
                bi.completion_date AS completionDate,
                bi.delivery_date AS deliveryDate,
                ac.id AS idAccount ,
                v.value AS voucherValue,
                bi.poin_use AS poin, 
                bi.money_ship AS moneyShip  
            FROM bill bi
            LEFT JOIN account ac ON ac.id = bi.id_account
            LEFT JOIN account em ON em.id = bi.id_employees
            LEFT JOIN voucher_detail vd ON bi.id = vd.id_bill
            LEFT JOIN voucher v ON vd.id_voucher = v.id 
            WHERE bi.code = :codeBill
                        """, nativeQuery = true)
    BillGiveBackInformation getBillGiveBackInformation(@Param("codeBill") String codeBill);

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY detail.last_modified_date DESC) AS stt,
                bd.id AS idBillDetail,
                detail.id AS idProductDetail,
                i.name AS image,
                CONCAT(p.name ,'[ ',s2.name,' - ',c2.name,' ]') AS nameProduct,
                bd.quantity AS quantity,
                bd.promotion AS promotion,
                bd.price AS price,
                c2.code AS codeColor,
                bd.status_bill AS statusBillDetail,
                bi.money_ship AS moneyShip 
            FROM bill bi
            JOIN bill_detail bd ON bi.id = bd.id_bill
            JOIN product_detail detail ON bd.id_product_detail = detail.id
            JOIN product p ON detail.id_product = p.id
            JOIN (
                SELECT id_product_detail, MAX(id) AS max_image_id
                FROM image
                GROUP BY id_product_detail
            ) max_images ON detail.id = max_images.id_product_detail
            LEFT JOIN image i ON max_images.max_image_id = i.id
            JOIN size s2 on detail.id_size = s2.id
            JOIN color c2 on detail.id_color = c2.id
            WHERE bi.id = :idBill AND bd.quantity > 0
            """, nativeQuery = true)
    List<BillGiveBack> getBillGiveBack(@Param("idBill") String idBill);

    @Query(value = """
            SELECT  ROW_NUMBER() OVER( ORDER BY bi.last_modified_date DESC ) AS stt,
                bi.id, bi.code, bi.created_date, bi.user_name AS userName ,  usem.full_name AS nameEmployees , bi.type, bi.status_bill,
                bi.last_modified_date AS lastModifiedDate ,
                bh.action_description AS note,
                CASE
                WHEN total_money + money_ship - item_discount < 0 THEN 0
                ELSE total_money + money_ship - item_discount
                END  AS total_money
                , bi.item_discount  FROM bill bi
            LEFT JOIN account ac ON ac.id = bi.id_account
            LEFT JOIN account em ON em.id = bi.id_employees
            LEFT JOIN customer cu ON cu.id = bi.id_customer
            LEFT JOIN user usac ON usac.id = ac.id_user
            LEFT JOIN user usem ON usem.id = em.id_user
            LEFT JOIN bill_history bh on bi.id = bh.id_bill
            WHERE bi.status_bill LIKE 'DA_HUY'  
            AND bh.last_modified_date = (SELECT MAX(bh2.last_modified_date) FROM bill_history bh2 WHERE bh2.id_bill = bi.id) 
            ORDER BY bi.last_modified_date DESC
                        """, nativeQuery = true)
    List<BillResponse> getBillCanceled();
}
