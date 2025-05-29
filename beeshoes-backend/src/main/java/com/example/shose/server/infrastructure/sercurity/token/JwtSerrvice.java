package com.example.shose.server.infrastructure.sercurity.token;

import com.example.shose.server.entity.Account;
import com.example.shose.server.infrastructure.config.EnvConfig;
import com.example.shose.server.infrastructure.session.UserDetailToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtSerrvice {

    // Lấy secret từ biến môi trường hoặc .env file, với giá trị mặc định nếu không có
    private String getJwtSecret() {
        return EnvConfig.get("JWT_SECRET");
    }

    public String genetateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", account.getId());
        claims.put("email", account.getUsername());
        claims.put("role", account.getRoles());
        claims.put("fullName", account.getUser().getFullName());
        claims.put("avata", account.getUser().getAvata());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 60 * 1000))
                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String genetateRefreshToken(Map<String, Object> extractClaims, Account account) {   
        extractClaims.put("id", account.getId());
        extractClaims.put("email", account.getUsername());
        extractClaims.put("role", account.getRoles());
        extractClaims.put("fullName", account.getUser().getFullName());
        extractClaims.put("avata", account.getUser().getAvata());
        return Jwts.builder()
                .setClaims(extractClaims)
                .setSubject(account.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 60 * 1000))
                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // todo xác nhận quyền sở hữu
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSiginKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSiginKey() {
        byte[] key = Decoders.BASE64.decode(getJwtSecret());
        return Keys.hmacShaKeyFor(key);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // todo kiểm tra hết hạn
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


    public void decodeTheToken(String token, HttpServletRequest request) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getJwtSecret())
                .build()
                .parseClaimsJws(token)
                .getBody();

        String fullName = claims.get("fullName", String.class);
        String email = claims.get("email", String.class);
        String id = claims.get("id", String.class);
        String role = claims.get("role", String.class);

        HttpSession session = request.getSession();
        var user = UserDetailToken.builder().id(id).role(role).fullName(fullName).email(email).build();
        if (user.getRole().equals("ROLE_USER")) {
            session.setAttribute("customer", user);
        } else {
            session.setAttribute("employee", user);
        }
    }
} 