package com.example.shose.server.infrastructure.sercurity.config;

import com.example.shose.server.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountDetalsServiceImpl implements AccountDetalsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return accountRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng"));
            }
        };
    }

}
