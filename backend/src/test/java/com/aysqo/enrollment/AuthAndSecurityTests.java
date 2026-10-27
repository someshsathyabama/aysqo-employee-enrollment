package com.aysqo.enrollment;

import com.aysqo.enrollment.dto.LoginRequest;
import com.aysqo.enrollment.entity.Role;
import com.aysqo.enrollment.entity.User;
import com.aysqo.enrollment.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthAndSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        if (!userRepository.existsByUsername("testadmin")) {
            User admin = new User(
                    "testadmin",
                    "testadmin@aysqo.com",
                    passwordEncoder.encode("AdminPass@123"),
                    "Test Admin",
                    Role.ADMIN,
                    true
            );
            userRepository.save(admin);
        }
    }

    @Test
    @DisplayName("Password Hashing: BCrypt securely hashes and matches raw passwords")
    void testPasswordHashing() {
        String rawPassword = "SecurePassword@2026";
        String encoded = passwordEncoder.encode(rawPassword);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));

        // Verify Admin@123 and Hr@123 hash validity
        String adminHash = "$2a$10$DEG2SWXy2/fDTUCcVVAjRuzHDP2esEtDvPhbFg5Lugjj6wrb4GbBC";
        String hrHash = "$2a$10$SYVPMMXv9v00ThKlcEnvUOjjwjliIMEob9uo2NIKGxtFtJJYccpyW";
        assertTrue(passwordEncoder.matches("Admin@123", adminHash));
        assertTrue(passwordEncoder.matches("Hr@123", hrHash));
    }

    @Test
    @DisplayName("Login Success: Valid credentials return JWT token and 200 OK")
    void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("testadmin", "AdminPass@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.username").value("testadmin"))
                .andExpect(jsonPath("$.data.user.role").value("ADMIN"))
                .andExpect(cookie().exists("aysqo_token"));
    }

    @Test
    @DisplayName("Login Failure: Bad credentials return generic error and 401 Unauthorized")
    void testLoginFailure() throws Exception {
        LoginRequest loginRequest = new LoginRequest("testadmin", "WrongPassword!999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("Unauthorized Access: Requesting protected endpoint without token returns 401")
    void testUnauthorizedEndpointAccess() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Role-Based Access: HR user cannot delete employees (403 Forbidden)")
    @WithMockUser(username = "hr_user", roles = {"HR"})
    void testRoleBasedAccessDeniedForHr() throws Exception {
        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Role-Based Access: ADMIN user is permitted to invoke delete endpoint")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void testRoleBasedAccessAllowedForAdmin() throws Exception {
        // If employee doesn't exist, will return 404 but NOT 403 Forbidden
        mockMvc.perform(delete("/api/employees/999999"))
                .andExpect(status().isNotFound());
    }
}
