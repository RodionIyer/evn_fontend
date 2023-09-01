package com.evnit.ttpm.khcn.security.jwt;

import com.evnit.ttpm.khcn.security.RSAKey;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;


@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${khcn.app.jwtSecret}")
    private String jwtSecret;

    @Value("${khcn.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${khcn.app.jwtCookieName}")
    private String jwtCookie;

    @Value("${khcn.app.publickeyEVNID}")
    private String publicKeyEVNID;



    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public String getUserNameFromJwtTokenEVNID(String token) {
        return Jwts.parser().setSigningKey(RSAKey.getPublicKey(publicKeyEVNID)).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtTokenEVNID(String authToken) {
        try {
            // Jwts.parser().setSigningKey(RSAKey.getPublicKey(publicKey)).parseClaimsJws(authToken);
            Jwts.parser().setSigningKey(RSAKey.getPublicKey(publicKeyEVNID)).parseClaimsJws(authToken)
                    .getBody();
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
            //throw new InvalidTokenRequestException("JWT", authToken, "Incorrect signature");

        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
            //throw new InvalidTokenRequestException("JWT", authToken, "Malformed jwt token");

        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
            throw ex;
            //throw new InvalidTokenRequestException("JWT", authToken, "Token expired. Refresh required");

        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
            //throw new InvalidTokenRequestException("JWT", authToken, "Unsupported JWT token");

        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
            //throw new InvalidTokenRequestException("JWT", authToken, "Illegal argument token");
        }
        return false;
    }

    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String generateTokenUpdateLinkNguoiThucHien(String username,String maNguoiThucHien,int jwtExpiration) {
        return Jwts.builder()
                .setSubject(username)
                .claim("MA_NGUOI_THUC_HIEN",maNguoiThucHien)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}
