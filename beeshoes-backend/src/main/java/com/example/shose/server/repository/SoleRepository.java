package com.example.shose.server.repository;

import com.example.shose.server.dto.request.sole.FindSoleRequest;
import com.example.shose.server.dto.response.SoleResponse;
import com.example.shose.server.dto.response.size.GetSizeInProductDetail;
import com.example.shose.server.dto.response.sole.GetSoleInProductDetail;
import com.example.shose.server.entity.Sole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface SoleRepository extends JpaRepository<Sole, String> {

    @Query(value = """
             SELECT
                ROW_NUMBER() OVER (ORDER BY s.last_modified_date DESC ) AS stt,
                s.id AS id,
                s.name AS name,
                s.status AS status,
                s.created_date AS createdDate,
                s.last_modified_date AS lastModifiedDate
            FROM sole s
            WHERE 
                ( :#{#req.name} IS NULL 
                    OR :#{#req.name} LIKE '' 
                    OR name LIKE %:#{#req.name}% )
             AND 
                ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR status LIKE :#{#req.status} ) 
            GROUP BY s.id
            ORDER BY s.last_modified_date DESC         
            """, nativeQuery = true)
    List<SoleResponse> getAll(@Param("req") FindSoleRequest req);

    @Query("SELECT s FROM Sole s WHERE s.name =:name")
    Sole getByName(@Param("name") String name);

    @Query("SELECT s FROM Sole s WHERE s.name =:name AND s.id <> :id")
    Sole getByNameExistence(@Param("name") String name, @Param("id") String id);

    @Query(value = """
            select s.id,s.name from sole s
            where s.id in (select pd.id_sole from product_detail pd)
            group by s.id,s.name
            """, nativeQuery = true)
    List<GetSoleInProductDetail> getSoleInProductDetail();

}
