package com.example.shose.server.service;

import com.example.shose.server.dto.request.notification.CreateNotificationRequest;
import com.example.shose.server.entity.Notification;

import java.util.List;

public interface NotificationService {

     List<Notification> getListNotiOfAdmin();
     List<Notification> getListNotiOfAdminnotRead();

     Notification createNoti(CreateNotificationRequest request);
     Notification updateStatusNoti(String id);

}
