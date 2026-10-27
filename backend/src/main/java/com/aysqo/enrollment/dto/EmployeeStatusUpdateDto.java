package com.aysqo.enrollment.dto;

import com.aysqo.enrollment.entity.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;

public class EmployeeStatusUpdateDto {

    @NotNull(message = "Enrollment status is required")
    private EnrollmentStatus status;

    public EmployeeStatusUpdateDto() {}

    public EmployeeStatusUpdateDto(EnrollmentStatus status) {
        this.status = status;
    }

    public EnrollmentStatus getStatus() { return status; }
    public void setStatus(EnrollmentStatus status) { this.status = status; }
}
