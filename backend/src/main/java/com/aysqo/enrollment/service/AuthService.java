package com.aysqo.enrollment.service;

import com.aysqo.enrollment.dto.LoginRequest;
import com.aysqo.enrollment.dto.LoginResponse;
import com.aysqo.enrollment.dto.UserSummaryDto;
import com.aysqo.enrollment.entity.User;
import com.aysqo.enrollment.exception.BadRequestException;
import com.aysqo.enrollment.exception.UnauthorizedException;
import com.aysqo.enrollment.repository.UserRepository;
import com.aysqo.enrollment.security.JwtTokenProvider;
import com.aysqo.enrollment.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    public LoginResponse authenticate(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername().trim(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            UserSummaryDto userSummary = new UserSummaryDto(
                    principal.getId(),
                    principal.getUsername(),
                    principal.getEmail(),
                    principal.getFullName(),
                    principal.getRole()
            );

            return new LoginResponse(token, userSummary);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        } catch (Exception ex) {
            throw new UnauthorizedException("Authentication failed: " + ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User profile not found"));
        return new UserSummaryDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }
}
