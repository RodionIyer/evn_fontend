package com.evnit.ttpm.khcn.controllers.admin;

import com.evnit.ttpm.khcn.payload.request.admin.LoginRequest;
import com.evnit.ttpm.khcn.payload.response.AppResponse;
import com.evnit.ttpm.khcn.payload.response.admin.SignInResponse;
import com.evnit.ttpm.khcn.payload.response.admin.UserInfoResponse;
import com.evnit.ttpm.khcn.security.jwt.JwtUtils;
import com.evnit.ttpm.khcn.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserDetailsService userDetailsService;

    @Value("${app.jwt.authType}")
    private String tokenRequestauthType;

    @PostMapping("/sign-in")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUserId(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            if (userDetails.getLocal()) {
                List<String> roles = userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList());

                return ResponseEntity.ok().body(new SignInResponse(jwtUtils.generateTokenFromUsername(userDetails.getUserId()),
                        new UserInfoResponse(userDetails.getUserId(), userDetails.getUsername(), userDetails.getDescript(), userDetails.getUserIdhrms(), userDetails.getORGID(), userDetails.getORGDESC(),
                                roles, userDetails.getFgrant(), 1, ""), 1, "Đăng nhập thành công"));
            } else {
                return ResponseEntity.ok().body(new SignInResponse(null, null, 0, "Đăng nhập lỗi"));
            }
        } catch (Exception e) {

            return ResponseEntity.ok().body(new SignInResponse(null, null, 0, "Đăng nhập lỗi"));
        }

    }

    @PostMapping("/sign-in-token")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> authenticateUserToken(@Valid @RequestBody Map<String, Object> loginRequest) {
        try {
            String token = loginRequest.get("accessToken").toString();
            if (token != null && jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUserNameFromJwtToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication
                        = new UsernamePasswordAuthenticationToken(userDetails,
                                null,
                                userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();

                List<String> roles = userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList());

                return ResponseEntity.ok().body(new SignInResponse(jwtUtils.generateTokenFromUsername(userDetailsImpl.getUserId()),
                        new UserInfoResponse(userDetailsImpl.getUserId(), userDetails.getUsername(), userDetailsImpl.getDescript(), userDetailsImpl.getUserIdhrms(), userDetailsImpl.getORGID(), userDetailsImpl.getORGDESC(),
                                roles, userDetailsImpl.getFgrant(), 1, ""), 1, "Đăng nhập thành công"));

            } else {
                //Validate EVNID
                if (token != null && jwtUtils.validateJwtTokenEVNID(token)) {
                    String username = jwtUtils.getUserNameFromJwtTokenEVNID(token);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authentication
                            = new UsernamePasswordAuthenticationToken(userDetails,
                                    null,
                                    userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();

                    List<String> roles = userDetails.getAuthorities().stream()
                            .map(item -> item.getAuthority())
                            .collect(Collectors.toList());

                    return ResponseEntity.ok().body(new SignInResponse(jwtUtils.generateTokenFromUsername(userDetailsImpl.getUserId()),
                            new UserInfoResponse(userDetailsImpl.getUserId(), userDetails.getUsername(), userDetailsImpl.getDescript(), userDetailsImpl.getUserIdhrms(), userDetailsImpl.getORGID(), userDetailsImpl.getORGDESC(),
                                    roles, userDetailsImpl.getFgrant(), 1, ""), 1, "Đăng nhập thành công"));
                }
                return ResponseEntity.ok().body(new SignInResponse(null, null, 0, "Đăng nhập lỗi"));
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.ok().body(new SignInResponse(null, null, 0, "Token không tồn tại"));
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        //ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok()
                .body(new AppResponse(1, "Bạn đã thoát!"));
    }
}
