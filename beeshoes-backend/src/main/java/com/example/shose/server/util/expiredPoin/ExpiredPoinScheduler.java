package com.example.shose.server.util.expiredPoin;

import com.example.shose.server.repository.UserReposiory;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

/**
 * @author thangdt
 */

@Configuration
@EnableScheduling
@Scope(proxyMode = ScopedProxyMode.INTERFACES)
@Transactional
public class ExpiredPoinScheduler {

    @Autowired
    private UserReposiory userReposiory;

    @Scheduled(cron = "0 0 0 1 6,12 ?")
    public void scheduledFixedDelayTask(){
        userReposiory.findAll().parallelStream().forEach(user ->{
            userReposiory.resetAllPoinUser(user.getId());
        });
    }
}
