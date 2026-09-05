package com.codewithnick.npay.security;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "VGhpc0lzQVN1cGVyU2VjcmV0S2V5Rm9yTW9ja1BheVNlY3VyZUtleTI1Ng==";

    private final long jwtExpiration =
            1000 * 60 * 60; // 1 hour

    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim(
                        "role",
                        userDetails.getAuthorities()
                                .iterator()
                                .next()
                                .getAuthority()
                )
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        String username =
                extractUsername(token);

        return username.equals(
                userDetails.getUsername()
        ) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
