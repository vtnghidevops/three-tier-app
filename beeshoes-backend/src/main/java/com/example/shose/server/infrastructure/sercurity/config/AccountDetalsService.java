package com.example.shose.server.infrastructure.sercurity.config;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountDetalsService {

    UserDetailsService userDetailsService();
}
