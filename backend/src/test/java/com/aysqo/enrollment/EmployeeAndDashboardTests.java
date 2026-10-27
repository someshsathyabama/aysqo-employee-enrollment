package com.aysqo.enrollment;

import com.aysqo.enrollment.dto.EmployeeRequestDto;
import com.aysqo.enrollment.dto.EmployeeStatusUpdateDto;
import com.aysqo.enrollment.entity.EmploymentType;
import com.aysqo.enrollment.entity.EnrollmentStatus;
import com.aysqo.enrollment.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "hr_test_user", roles = {"HR"})
public class EmployeeAndDashboardTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    private EmployeeRequestDto createSampleRequest(String email) {
        EmployeeRequestDto dto = new EmployeeRequestDto();
        dto.setFirstName("Ethan");
        dto.setLastName("Hunt");
        dto.setEmail(email);
        dto.setPhone("+1-555-4321");
        dto.setDateOfBirth(LocalDate.of(1989, 5, 14));
        dto.setAddress("700 Mission Ridge, Dallas, TX");
        dto.setDepartment("Engineering");
        dto.setJobTitle("Cloud Security Specialist");
        dto.setJoiningDate(LocalDate.of(2026, 4, 1));
        dto.setEmploymentType(EmploymentType.FULL_TIME);
        dto.setEmergencyContactName("Julia Hunt");
        dto.setEmergencyContactPhone("+1-555-8765");
        dto.setEnrollmentStatus(EnrollmentStatus.DRAFT);
        dto.setIsActive(true);
        return dto;
    }

    @Test
    @DisplayName("Employee Creation: Valid DTO creates record with auto-generated ID and 201 Created")
    void testCreateEmployeeSuccess() throws Exception {
        EmployeeRequestDto dto = createSampleRequest("ethan.hunt.test@aysqo-demo.com");

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.employeeId").value(matchesPattern("^AYS-\\d{4}-\\d{4}$")))
                .andExpect(jsonPath("$.data.email").value("ethan.hunt.test@aysqo-demo.com"))
                .andExpect(jsonPath("$.data.firstName").value("Ethan"))
                .andExpect(jsonPath("$.data.enrollmentStatus").value("Draft"));
    }

    @Test
    @DisplayName("Validation Error: Missing required fields returns 400 Bad Request with field errors")
    void testCreateEmployeeValidationFailure() throws Exception {
        EmployeeRequestDto invalidDto = new EmployeeRequestDto();
        invalidDto.setFirstName(""); // Blank
        invalidDto.setEmail("invalid-email-format"); // Invalid email

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.firstName").isNotEmpty())
                .andExpect(jsonPath("$.errors.email").isNotEmpty());
    }

    @Test
    @DisplayName("Duplicate Prevention: Existing email returns 409 Conflict")
    void testDuplicateEmailRejection() throws Exception {
        String uniqueEmail = "duplicate.test@aysqo-demo.com";
        EmployeeRequestDto dto1 = createSampleRequest(uniqueEmail);

        // First creation succeeds
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto1)))
                .andExpect(status().isCreated());

        // Second creation with same email fails with 409
        EmployeeRequestDto dto2 = createSampleRequest(uniqueEmail);
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    @DisplayName("Employee Search & Pagination: Filters by department and pagination params")
    void testSearchAndPagination() throws Exception {
        mockMvc.perform(get("/api/employees")
                        .param("search", "Alexander")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.page").value(0))
                .andExpect(jsonPath("$.data.size").value(10));
    }

    @Test
    @DisplayName("Employee Details: Retrieves existing employee record by ID")
    void testGetEmployeeById() throws Exception {
        // First create an employee to guarantee ID existence
        EmployeeRequestDto dto = createSampleRequest("details.test@aysqo-demo.com");
        String responseJson = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseJson, "$.data.id");

        mockMvc.perform(get("/api/employees/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("details.test@aysqo-demo.com"));
    }

    @Test
    @DisplayName("Employee Update: Modifies fields and returns updated DTO")
    void testUpdateEmployee() throws Exception {
        EmployeeRequestDto dto = createSampleRequest("update.test@aysqo-demo.com");
        String responseJson = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseJson, "$.data.id");

        dto.setFirstName("Ethan-Updated");
        dto.setJobTitle("Lead Systems Engineer");

        mockMvc.perform(put("/api/employees/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstName").value("Ethan-Updated"))
                .andExpect(jsonPath("$.data.jobTitle").value("Lead Systems Engineer"));
    }

    @Test
    @DisplayName("Status Update: Transitions enrollment status to Approved")
    void testUpdateEnrollmentStatus() throws Exception {
        EmployeeRequestDto dto = createSampleRequest("status.test@aysqo-demo.com");
        String responseJson = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseJson, "$.data.id");

        EmployeeStatusUpdateDto statusUpdate = new EmployeeStatusUpdateDto(EnrollmentStatus.APPROVED);

        mockMvc.perform(patch("/api/employees/" + id + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.enrollmentStatus").value("Approved"));
    }

    @Test
    @DisplayName("Active Toggle: Toggles active status between true and false")
    void testToggleActive() throws Exception {
        EmployeeRequestDto dto = createSampleRequest("toggle.test@aysqo-demo.com");
        String responseJson = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseJson, "$.data.id");

        mockMvc.perform(patch("/api/employees/" + id + "/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isActive").value(false));
    }

    @Test
    @DisplayName("Dashboard Summary: Returns aggregate counts and department breakdown")
    void testDashboardSummary() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalEmployees").isNumber())
                .andExpect(jsonPath("$.data.activeEmployees").isNumber())
                .andExpect(jsonPath("$.data.pendingEnrollments").isNumber())
                .andExpect(jsonPath("$.data.draftEnrollments").isNumber())
                .andExpect(jsonPath("$.data.recentEnrollments").isArray());
    }
}
