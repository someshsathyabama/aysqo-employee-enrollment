package com.aysqo.enrollment.controller;

import com.aysqo.enrollment.dto.ApiResponse;
import com.aysqo.enrollment.dto.LoginRequest;
import com.aysqo.enrollment.dto.LoginResponse;
import com.aysqo.enrollment.dto.UserSummaryDto;
import com.aysqo.enrollment.security.UserPrincipal;
import com.aysqo.enrollment.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        LoginResponse loginResponse = authService.authenticate(loginRequest);

        // Set secure HttpOnly cookie for session security
        Cookie cookie = new Cookie("aysqo_token", loginResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set to true in production HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(86400); // 24 hours
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.ok("Authentication successful", loginResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("aysqo_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.ok("Successfully logged out", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserSummaryDto userSummary = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(userSummary));
    }
}
