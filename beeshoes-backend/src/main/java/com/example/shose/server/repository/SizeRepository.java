package com.example.shose.server.repository;

import com.example.shose.server.dto.request.size.FindSizeRequest;
import com.example.shose.server.dto.response.SizeResponse;
import com.example.shose.server.dto.response.material.GetMaterialInProductDetail;
import com.example.shose.server.dto.response.size.GetSizeInProductDetail;
import com.example.shose.server.entity.Size;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.crypto.spec.OAEPParameterSpec;
import java.util.List;
import java.util.Optional;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface SizeRepository extends JpaRepository<Size, String> {

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY si.last_modified_date DESC ) AS stt,
                si.id AS id,
                si.name AS name,
                si.status AS status,
                si.created_date AS createdDate,
                si.last_modified_date AS lastModifiedDate
            FROM size si
            WHERE 
                ( :#{#req.name} IS NULL 
                    OR :#{#req.name} LIKE '' 
                    OR name LIKE %:#{#req.name}% )
             AND 
                ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR status LIKE :#{#req.status} )
            GROUP BY si.id
            ORDER BY si.last_modified_date DESC  
            """, nativeQuery = true)
    List<SizeResponse> getAll(@Param("req") FindSizeRequest req);

    @Query("SELECT a FROM Size a WHERE a.name=:name")
    Size getOneByName(@Param("name") int name);

    @Query("SELECT s FROM Size s WHERE s.name =:name AND s.id <> :id")
    Size getByNameExistence(@Param("name") int name, @Param("id") String id);

    @Query("SELECT s FROM Size s ORDER BY s.name ASC ")
    List<Size> findAll();

    Optional<Size> findByName(Integer name);

    @Query(value = """
            select s.id,s.name from size s
            where s.id in (select pd.id_size from product_detail pd)
            group by s.id,s.name
            order by s.name asc 
            """, nativeQuery = true)
    List<GetSizeInProductDetail> getSizeInProductDetail();
}
