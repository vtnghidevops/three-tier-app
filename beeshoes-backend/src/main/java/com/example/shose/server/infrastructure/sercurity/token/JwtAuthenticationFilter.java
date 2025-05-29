package com.example.shose.server.infrastructure.sercurity.token;

import com.example.shose.server.infrastructure.sercurity.config.AccountDetalsService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtSerrvice jwtSerrvice;

    private final AccountDetalsService accountDetalsService;

    @Override
    protected void doFilterInternal(
           @NonNull HttpServletRequest request,
           @NonNull HttpServletResponse response,
           @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authheader = request.getHeader("Authorization");
        final String jwt;
        final String userEamil;
        if (StringUtils.isEmpty(authheader) || !org.apache.commons.lang3.StringUtils.startsWith(authheader, "Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authheader.substring(7);
        userEamil = jwtSerrvice.extractUserName(jwt);

        if (StringUtils.isNotEmpty(userEamil) && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = accountDetalsService.userDetailsService().loadUserByUsername(userEamil);

            if (jwtSerrvice.isTokenValid(jwt, userDetails)) {
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                securityContext.setAuthentication(token);
                SecurityContextHolder.setContext(securityContext);
                jwtSerrvice.decodeTheToken(jwt,request);
            }
        }
        filterChain.doFilter(request, response);
    }


}
