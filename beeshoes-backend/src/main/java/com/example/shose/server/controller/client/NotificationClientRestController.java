package com.example.shose.server.controller.client;

import com.example.shose.server.service.MaterialService;
import com.example.shose.server.service.NotificationService;
import com.example.shose.server.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/client/notification")
public class NotificationClientRestController {
    @Autowired
    private NotificationService notificationService;
    @GetMapping("/listAdmin")
    public ResponseObject getListNotiAdmin() {
        return new ResponseObject(notificationService.getListNotiOfAdmin());
    }
    @GetMapping("/listAdminNotRead")
    public ResponseObject getListNotiAdminNotRead() {
        return new ResponseObject(notificationService.getListNotiOfAdminnotRead());
    }
    @PostMapping("/setStatus/{id}")
    public ResponseObject setStatus(@PathVariable("id") String id) {
        return new ResponseObject(notificationService.updateStatusNoti(id));
    }
}
