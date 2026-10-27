package com.aysqo.enrollment.controller;

import com.aysqo.enrollment.dto.*;
import com.aysqo.enrollment.entity.EmploymentType;
import com.aysqo.enrollment.entity.EnrollmentStatus;
import com.aysqo.enrollment.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<EmployeeResponseDto>>> getEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) EnrollmentStatus enrollmentStatus,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PagedResponse<EmployeeResponseDto> response = employeeService.searchEmployees(
                search, department, employmentType, enrollmentStatus, active, pageable
        );

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> createEmployee(
            @Valid @RequestBody EmployeeRequestDto employeeRequestDto) {
        EmployeeResponseDto created = employeeService.createEmployee(employeeRequestDto);
        return new ResponseEntity<>(ApiResponse.ok("Employee enrolled successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponseDto employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.ok(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDto employeeRequestDto) {
        EmployeeResponseDto updated = employeeService.updateEmployee(id, employeeRequestDto);
        return ResponseEntity.ok(ApiResponse.ok("Employee updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeStatusUpdateDto statusDto) {
        EmployeeResponseDto updated = employeeService.updateEnrollmentStatus(id, statusDto.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Enrollment status updated to " + statusDto.getStatus(), updated));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> toggleActive(@PathVariable Long id) {
        EmployeeResponseDto updated = employeeService.toggleActiveStatus(id);
        String state = Boolean.TRUE.equals(updated.getIsActive()) ? "activated" : "deactivated";
        return ResponseEntity.ok(ApiResponse.ok("Employee successfully " + state, updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee deleted successfully", null));
    }
}
