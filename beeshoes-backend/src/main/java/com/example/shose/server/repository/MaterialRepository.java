package com.example.shose.server.repository;

import com.example.shose.server.dto.request.material.FindMaterialRequest;
import com.example.shose.server.dto.response.MaterialResponse;
import com.example.shose.server.dto.response.brand.GetBrandInProductDetail;
import com.example.shose.server.dto.response.material.GetMaterialInProductDetail;
import com.example.shose.server.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY m.last_modified_date DESC ) AS stt,
                m.id AS id,
                m.name AS name,
                m.status AS status,
                m.created_date AS createdDate,
                m.last_modified_date AS lastModifiedDate
            FROM material m
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
    List<MaterialResponse> getAll(@Param("req") FindMaterialRequest req);

    @Query("SELECT a FROM Material a WHERE a.name=:name")
    Material getOneByName(@Param("name") String name);

    @Query("SELECT s FROM Material s WHERE s.name =:name AND s.id <> :id")
    Material getByNameExistence(@Param("name") String name, @Param("id") String id);
    @Query(value = """
            select m.id,m.name from material m
            where m.id in (select pd.id_material from product_detail pd)
            group by m.id,m.name
            """, nativeQuery = true)
    List<GetMaterialInProductDetail> getMaterialInProductDetail();
}
