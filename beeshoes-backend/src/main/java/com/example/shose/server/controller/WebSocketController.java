package com.example.shose.server.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin("*")
public class WebSocketController {
    @MessageMapping("/notifyAdmin")
    @SendTo("/app/admin-notifications")
    public String notifyAdmin(String message) {
        return message;
    }
}
