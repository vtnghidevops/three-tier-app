package com.example.shose.server.repository;

import com.example.shose.server.entity.Notification;
import com.example.shose.server.infrastructure.constant.Status;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Nguyễn Vinh
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification,String> {
    List<Notification> findAllByReceiver(@Param("receiver") String receiver, Sort sort);

    List<Notification> findAllByReceiverAndStatus(@Param("receiver") String receiver ,@Param("status") Status status);
}
