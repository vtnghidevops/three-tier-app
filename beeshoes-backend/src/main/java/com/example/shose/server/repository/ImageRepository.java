package com.example.shose.server.repository;

import com.example.shose.server.dto.response.ImageResponse;
import com.example.shose.server.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface ImageRepository extends JpaRepository<Image,String> {

    @Query(value = """
                SELECT
                     i.id AS id,
                     i.name AS name,
                     i.status AS status
                FROM product_detail pd
                JOIN image i on pd.id = i.id_product_detail
                WHERE pd.id = :id
            """, nativeQuery = true)
    List<ImageResponse> findAllByIdProductDetail (@Param("id") String id);

    @Query("SELECT i FROM Image i WHERE i.productDetail.id =:id ")
    List<Image> getAllByIdProductDetail (@Param("id") String id);

}