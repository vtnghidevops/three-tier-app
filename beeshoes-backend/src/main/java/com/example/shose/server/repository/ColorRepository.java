package com.example.shose.server.repository;

import com.example.shose.server.dto.request.color.FindColorRequest;
import com.example.shose.server.dto.response.ColorResponse;
import com.example.shose.server.dto.response.color.GetColorInProductDetail;
import com.example.shose.server.dto.response.sole.GetSoleInProductDetail;
import com.example.shose.server.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface ColorRepository extends JpaRepository<Color, String> {
    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY m.last_modified_date DESC ) AS stt,
                m.id AS id,
                m.code AS code,
                m.name AS name,
                m.status AS status,
                m.created_date AS createdDate,
                m.last_modified_date AS lastModifiedDate
            FROM color m
            WHERE 
                    ( :#{#req.code} IS NULL 
                    OR :#{#req.code} LIKE '' 
                    OR code LIKE %:#{#req.code}% )
            AND 
                    ( :#{#req.name} IS NULL 
                    OR :#{#req.name} LIKE '' 
                    OR name LIKE %:#{#req.name}% )
            GROUP BY m.id
            ORDER BY m.last_modified_date DESC  
            """, nativeQuery = true)
    List<ColorResponse> getAll(@Param("req") FindColorRequest req);

    @Query("SELECT a FROM Color a WHERE a.code =:code")
    Color getOneByCode(@Param("code") String code);

    @Query("SELECT s FROM Color s WHERE s.code =:code AND s.id <> :id")
    Color getByNameExistence(@Param("code") String code, @Param("id") String id);

    @Query("SELECT DISTINCT  c FROM  Color c ")
    List<Color> getAllCode ();

    @Query(value = """
            select REPLACE(c.code, '#', '%23') as code,c.name as name from color c
            where c.id in (select pd.id_color from product_detail pd)
            group by c.code,c.name
            """, nativeQuery = true)
    List<GetColorInProductDetail> getColorInProductDetail();
}
