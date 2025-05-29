package com.example.shose.server;

import com.example.shose.server.entity.Account;
import com.example.shose.server.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class ServerApplication  {

//    @Autowired
//    private AccountRepository accountRepository;

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }


//    @Override
//    public void run(String... args) throws Exception {
//        initializeDatabase();
//    }
//
//    private void initializeDatabase() {
//        Account account =
//        if (accountRepository.count() == 0) {
//            Account account = new Account();
//
//            accountRepository.save(account);
//        }
//    }

}
