package com.example.shose.server.repository;

import com.example.shose.server.dto.request.product.FindProductRequest;
import com.example.shose.server.dto.request.product.FindProductUseRequest;
import com.example.shose.server.dto.request.productdetail.FindProductDetailRequest;
import com.example.shose.server.dto.response.CustomProductRespone;
import com.example.shose.server.dto.response.ProductDetailReponse;
import com.example.shose.server.dto.response.ProductResponse;
import com.example.shose.server.dto.response.product.ProductUseRespone;
import com.example.shose.server.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * @author Nguyễn Vinh
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY GREATEST(p.last_modified_date, MAX(pd.last_modified_date)) DESC) AS stt,
                p.id AS id,
                p.id AS id,
                p.code AS code,
                p.name AS nameProduct,
                p.status AS status,
                SUM(pd.quantity) AS totalQuantity
            FROM product p
            JOIN product_detail pd ON p.id = pd.id_product
            WHERE (
                  :#{#req.keyword} IS NULL OR :#{#req.keyword} = ''
                  OR p.code LIKE %:#{#req.keyword}% 
                  OR p.name LIKE %:#{#req.keyword}%
              )
            AND  ( :#{#req.status} IS NULL   OR :#{#req.status} LIKE '' OR p.status LIKE :#{#req.status} )
            AND  ( :#{#req.minQuantity} IS NULL OR pd.quantity >= :#{#req.minQuantity} ) 
            AND  ( :#{#req.maxQuantity} IS NULL OR pd.quantity <= :#{#req.maxQuantity} )
            GROUP BY  p.id, p.status
            ORDER BY GREATEST(p.last_modified_date, MAX(pd.last_modified_date)) DESC 
            """, nativeQuery = true)
    List<ProductResponse> getAll(@Param("req") FindProductRequest req);

    @Query("SELECT p FROM Product p WHERE p.code =:code")
    Product getOneByCode (@Param("code") String code);

    @Query("SELECT p FROM Product p WHERE p.name =:name")
    Product getOneByName (@Param("name") String name);

    @Query("SELECT s FROM Product s WHERE s.code =:code AND s.id <> :id")
    Product getByNameExistence(@Param("code") String code, @Param("id") String id);
    @Query(value = """
            SELECT
                p.id AS id,
                p.name AS nameProduct,
                p.code AS code,
                p.status AS status
            FROM product p            
            WHERE (
                  :#{#req.keyword} IS NULL OR :#{#req.keyword} = ''
                  OR p.code LIKE %:#{#req.keyword}% 
                  OR p.name LIKE %:#{#req.keyword}%
              ) and p.status = 'DANG_SU_DUNG' and p.id in (select pd.id_product from product_detail pd)
            ORDER BY p.last_modified_date DESC  
            """, nativeQuery = true)
    List<ProductUseRespone> getProductUse(@Param("req") FindProductUseRequest req);

    @Query(value = """ 
        SELECT p.name FROM product p WHERE ( :name IS NULL   OR :name LIKE '' OR p.name LIKE %:name% )
 """,nativeQuery = true)
    List<String> findAllByName(@Param("name")String name);


    @Query(value = """
                SELECT
                   ROW_NUMBER() OVER (ORDER BY detail.last_modified_date DESC) AS stt,
                   detail.id AS id,
                   i.name AS image,
                   CONCAT(p.name ,'[ ',s2.name,' - ',c2.name,' ]') AS nameProduct,
                   detail.price AS price,
                   detail.created_date AS created_date,
                   detail.gender AS gender,
                   detail.status AS status,
                   si.name AS nameSize,
                   c.name AS nameCategory,
                   b.name AS nameBrand,
                   detail.quantity AS quantity,
                   (SELECT MAX(p2.value)
                       FROM promotion_product_detail ppd2
                       LEFT JOIN promotion p2 ON ppd2.id_promotion = p2.id
                       LEFT JOIN product_detail pd on ppd2.id_product_detail = pd.id
                       WHERE ppd2.status='DANG_SU_DUNG' AND pd.id = detail.id AND p2.status ='DANG_KICH_HOAT')
                   AS promotion,
                   detail.quantity,
                   s2.name AS size,
                   c2.code AS color,
                   detail.maqr AS QRCode
                FROM product_detail detail
                JOIN product p ON detail.id_product = p.id
                JOIN (
                    SELECT id_product_detail, MAX(id) AS max_image_id
                    FROM image
                    GROUP BY id_product_detail
                ) max_images ON detail.id = max_images.id_product_detail
                LEFT JOIN image i ON max_images.max_image_id = i.id
                JOIN sole s ON s.id = detail.id_sole
                JOIN material m ON detail.id_material = m.id
                JOIN category c ON detail.id_category = c.id
                JOIN brand b ON detail.id_brand = b.id
                LEFT JOIN promotion_product_detail ppd on detail.id = ppd.id_product_detail
                LEFT JOIN promotion pr on pr.id = ppd.id_promotion
                JOIN size s2 on detail.id_size = s2.id
                JOIN color c2 on detail.id_color = c2.id
                LEFT JOIN size si ON detail.id_size = si.id
                WHERE i.status = true  
                AND  ( :#{#req.size} = 0 OR s2.name = :#{#req.size} OR :#{#req.size} = '' )
                AND  ( :#{#req.color} IS NULL OR c2.code LIKE %:#{#req.color}% OR :#{#req.color} LIKE '' )
                AND  ( :#{#req.brand} IS NULL OR b.name LIKE %:#{#req.brand}% OR :#{#req.brand} LIKE '' )
                AND  ( :#{#req.material} IS NULL OR :#{#req.material} LIKE '' OR m.name LIKE %:#{#req.material}% ) 
                AND  ( :#{#req.product} IS NULL OR :#{#req.product} LIKE ''  OR p.name LIKE %:#{#req.product}% ) 
                AND  ( :#{#req.sole} IS NULL  OR :#{#req.sole} LIKE '' OR s.name LIKE %:#{#req.sole}% )
                AND  ( :#{#req.category} IS NULL OR :#{#req.category} LIKE '' OR c.name LIKE %:#{#req.category}% )
                AND  ( :#{#req.status} IS NULL   OR :#{#req.status} LIKE '' OR detail.status LIKE :#{#req.status} )
                AND  ( :#{#req.gender} IS NULL OR :#{#req.gender} LIKE '' OR detail.gender LIKE :#{#req.gender} )
                AND  ( :#{#req.minPrice} IS NULL OR detail.price >= :#{#req.minPrice} ) 
                AND  ( :#{#req.maxPrice} IS NULL OR detail.price <= :#{#req.maxPrice} )
                GROUP BY detail.id, i.name, p.name, s2.name, c2.name, detail.price, detail.created_date, detail.gender, detail.status, si.name, c.name, b.name, detail.quantity, s2.name, c2.code
                ORDER BY detail.last_modified_date DESC 
                 
            """, nativeQuery = true)
    List<ProductDetailReponse> getAllProduct(@Param("req") FindProductDetailRequest req);

}
