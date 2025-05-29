package com.example.shose.server.repository;

import com.example.shose.server.dto.request.brand.FindBrandRequest;
import com.example.shose.server.dto.response.BrandResponse;
import com.example.shose.server.dto.response.brand.GetBrandInProductDetail;
import com.example.shose.server.dto.response.category.GetCategoryInProductDetail;
import com.example.shose.server.entity.Brand;
import com.example.shose.server.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY m.last_modified_date DESC ) AS stt,
                m.id AS id,
                m.name AS name,
                m.status AS status,
                m.created_date AS createdDate,
                m.last_modified_date AS lastModifiedDate
            FROM brand m
            WHERE 
                ( :#{#req.name} IS NULL 
                    OR :#{#req.name} LIKE '' 
                    OR name LIKE %:#{#req.name}% ) 
            AND 
              ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR status LIKE :#{#req.status} )
            GROUP BY m.id
            ORDER BY m.last_modified_date DESC  
            """, nativeQuery = true)
    List<BrandResponse> getAll(@Param("req") FindBrandRequest req);

    @Query("SELECT a FROM Brand a WHERE a.name =:name")
    Brand getOneByName(@Param("name") String name);

    @Query("SELECT s FROM Brand s WHERE s.name =:name AND s.id <> :id")
    Brand getByNameExistence(@Param("name") String name,
                                @Param("id") String id);
    @Query(value = """
            select b.id,b.name from brand b
            where b.id in (select pd.id_brand from product_detail pd)
            group by b.id,b.name
            """, nativeQuery = true)
    List<GetBrandInProductDetail> getBrandInProductDetail();

}
