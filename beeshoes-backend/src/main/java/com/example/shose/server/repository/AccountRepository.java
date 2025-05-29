package com.example.shose.server.repository;

import com.example.shose.server.dto.response.account.AccountResponse;
import com.example.shose.server.dto.response.employee.SimpleEmployeeResponse;
import com.example.shose.server.entity.Account;
import com.example.shose.server.entity.User;
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
public interface AccountRepository extends JpaRepository<Account, String> {

    @Query("SELECT ac FROM Account ac WHERE ac.email =:email")
    Account getOneByEmail(@Param("email") String email);
    Optional<Account> getByEmail(String email);

    @Query(value = """
             SELECT ac.id, us.full_name FROM account ac
                        LEFT JOIN user us ON us.id = ac.id_user
                        WHERE roles IN (0,2)
            """, nativeQuery = true)
    List<SimpleEmployeeResponse> getAllSimpleEntityEmployess();

    @Query("SELECT ac FROM Account ac WHERE ac.email =:email AND ac.user.phoneNumber =:phoneNumber")
    Account resetPassword(@Param("email") String email , @Param("phoneNumber") String phoneNumber);

    @Query(value = "SELECT ac.id, us.full_name AS fullName, us.phone_number AS phoneNumber,  us.email AS email, us.points" +
            " FROM account ac\n" +
            "LEFT JOIN user us ON us.id = ac.id_user\n" +
            "LEFT JOIN bill bi ON bi.id_account = ac.id\n" +
            "WHERE bi.id  = :idBill", nativeQuery = true)
    AccountResponse getAccountUserByIdBill(@Param("idBill") String idBill );

    @Query("SELECT ac FROM Account ac WHERE ac.email =:email")
    Optional<Account> findByEmail(String email);

    @Query("SELECT a FROM Account a WHERE a.roles = :role")
    Optional<Account> findByRole(@Param("role") String role);

    @Query("SELECT ac FROM Account ac WHERE ac.email =:email AND ac.password =:password")
    Account getOneByEmailPassword(@Param("email") String email , @Param("password") String password);

    Optional<Account> findByUser(User user);
}