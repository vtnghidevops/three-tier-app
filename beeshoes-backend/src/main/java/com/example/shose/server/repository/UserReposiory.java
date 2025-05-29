package com.example.shose.server.repository;

import com.example.shose.server.dto.request.employee.FindEmployeeRequest;
import com.example.shose.server.dto.response.EmployeeResponse;
import com.example.shose.server.dto.response.user.GetByAccountResponse;
import com.example.shose.server.dto.response.user.SimpleUserResponse;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * @author Nguyễn Vinh
 */
@Repository
public interface UserReposiory extends JpaRepository<User, String> {
    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY u.last_modified_date DESC ) AS stt,
                u.id AS id,
                u.gender AS gender,
                u.full_name AS fullName,
                u.date_of_birth AS dateOfBirth,
                u.avata AS avata,
                u.points AS points,
                u.email AS email,
                u.phone_number AS phoneNumber,
                u.updated_by AS updatedBy,
                u.created_by AS createdBy,
                u.status AS status,
                u.created_date AS createdDate,
                u.last_modified_date AS lastModifiedDate,
                u.citizen_identity AS citizenIdentity,
                a.password AS passWord,
                a.id AS idAccount
            FROM user u
              JOIN account a ON u.id = a.id_user
            WHERE a.roles='ROLE_EMLOYEE'
             AND  
              ( :#{#req.fullName} IS NULL 
                    OR :#{#req.fullName} LIKE '' 
                    OR u.full_name LIKE %:#{#req.fullName}% ) 
                AND
                ( :#{#req.email} IS NULL 
                    OR :#{#req.email} LIKE '' 
                    OR u.email LIKE %:#{#req.email}% ) 
                AND
                 ( :#{#req.phoneNumber} IS NULL 
                    OR :#{#req.phoneNumber} LIKE '' 
                    OR u.phone_number LIKE %:#{#req.phoneNumber}% )
                 AND 
                  ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR u.status LIKE :#{#req.status} )
            GROUP BY u.id
            ORDER BY u.last_modified_date DESC  
            """, nativeQuery = true)
    List<EmployeeResponse> getAll(@Param("req") FindEmployeeRequest req);

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY u.last_modified_date DESC ) AS stt,
                u.id AS id,
                u.gender AS gender,
                u.full_name AS fullName,
                u.date_of_birth AS dateOfBirth,
                u.avata AS avata,
                u.email AS email,
                u.points AS points,
                u.phone_number AS phoneNumber,
                u.updated_by AS updatedBy,
                u.created_by AS createdBy,
                u.status AS status,
                u.created_date AS createdDate,
                u.last_modified_date AS lastModifiedDate,
                 u.citizen_identity AS citizenIdentity,
                 a.password AS passWord,
                 a.id AS idAccount
            FROM user u
              JOIN account a ON u.id = a.id_user
            WHERE a.roles='ROLE_USER'
             AND  
              ( :#{#req.fullName} IS NULL 
                    OR :#{#req.fullName} LIKE '' 
                    OR u.full_name LIKE %:#{#req.fullName}% ) 
                AND
                ( :#{#req.email} IS NULL 
                    OR :#{#req.email} LIKE '' 
                    OR u.email LIKE %:#{#req.email}% ) 
                AND
                 ( :#{#req.phoneNumber} IS NULL 
                    OR :#{#req.phoneNumber} LIKE '' 
                    OR u.phone_number LIKE %:#{#req.phoneNumber}% )
                 AND 
                  ( :#{#req.status} IS NULL 
                    OR :#{#req.status} LIKE '' 
                    OR u.status LIKE :#{#req.status} )
            GROUP BY u.id
            ORDER BY u.last_modified_date DESC  
            """, nativeQuery = true)
    List<EmployeeResponse> getAllCustomer(@Param("req") FindEmployeeRequest req);

    @Query(value = """
            SELECT
             ROW_NUMBER() OVER (ORDER BY u.last_modified_date DESC ) AS stt,
                u.id AS id,
                u.gender AS gender,
                u.full_name AS fullName,
                u.date_of_birth AS dateOfBirth,
                u.avata AS avata,
                u.email AS email,
                u.points AS points,
                u.phone_number AS phoneNumber,
                u.updated_by AS updatedBy,
                u.created_by AS createdBy,
                u.status AS status,
                u.created_date AS createdDate,
                u.last_modified_date AS lastModifiedDate,
                u.citizen_identity AS citizenIdentity,
                a.password AS password,
                a.id AS idAccount
            FROM user u
            JOIN account a ON u.id = a.id_user
            WHERE u.id = :id
            """, nativeQuery = true)
    Optional<EmployeeResponse> getOneWithPassword(@Param("id") String id);

    @Query(value = """
    SELECT
        ROW_NUMBER() OVER (ORDER BY u.last_modified_date DESC) AS stt,
        u.id AS id,
        u.gender AS gender,
        u.full_name AS fullName,
        u.date_of_birth AS dateOfBirth,
        u.avata AS avata,
        u.email AS email,
        u.points AS points,
        u.phone_number AS phoneNumber,
        u.updated_by AS updatedBy,
        u.created_by AS createdBy,
        u.status AS status,
        u.created_date AS createdDate,
        u.last_modified_date AS lastModifiedDate,
        u.citizen_identity AS citizenIdentity,
        a.id AS idAccount
    FROM user u
    WHERE  (:#{#req.startTime} = 0 OR u.date_of_birth >= :#{#req.startTime})
    AND    (:#{#req.endTime} = 0 OR u.date_of_birth <= :#{#req.endTime})
    AND    (YEAR(CURRENT_DATE()) - YEAR(u.date_of_birth) >= :#{#req.minAge})
    AND    (YEAR(CURRENT_DATE()) - YEAR(u.date_of_birth) <= :#{#req.maxAge})
""", nativeQuery = true)
    List<EmployeeResponse> findByDate(@Param("req") FindEmployeeRequest req);


    @Query("SELECT u FROM  User u WHERE u.phoneNumber =:phoneNumber")
    User getOneUserByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT u FROM  Account u WHERE u.email =:email")
    Account getOneUserByEmail(@Param("email") String email);

    @Query(value = """
            SELECT
             ROW_NUMBER() OVER (ORDER BY u.last_modified_date DESC ) AS stt,
                u.id AS id,
                u.gender AS gender,
                u.full_name AS fullName,
                u.date_of_birth AS dateOfBirth,
                u.avata AS avata,
                u.email AS email,
                u.points AS points,
                u.phone_number AS phoneNumber,
                u.updated_by AS updatedBy,
                u.created_by AS createdBy,
                u.status AS status,
                u.created_date AS createdDate,
                u.last_modified_date AS lastModifiedDate,
                u.citizen_identity AS citizenIdentity,
                a.password AS password,
                a.id AS idAccount
            FROM user u
            JOIN account a ON u.id = a.id_user
            WHERE u.phoneNumber = :phoneNumber
            """, nativeQuery = true)
    Optional<EmployeeResponse> getOneByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query(value = """
            SELECT
                u.id AS id
            FROM user u
            JOIN account a ON u.id = a.id_user
            WHERE a.id = :idAccount
            """, nativeQuery = true)
    Optional<GetByAccountResponse> getByAccount(String idAccount);

    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE user
            SET points = 0
            WHERE id = :id
            """, nativeQuery = true)
    void resetAllPoinUser(String id);

}