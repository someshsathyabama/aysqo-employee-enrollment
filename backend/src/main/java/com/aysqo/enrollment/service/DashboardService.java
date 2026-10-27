package com.aysqo.enrollment.service;

import com.aysqo.enrollment.dto.DashboardSummaryDto;
import com.aysqo.enrollment.dto.EmployeeResponseDto;
import com.aysqo.enrollment.entity.EnrollmentStatus;
import com.aysqo.enrollment.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;

    public DashboardService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto summary = new DashboardSummaryDto();

        summary.setTotalEmployees(employeeRepository.count());
        summary.setActiveEmployees(employeeRepository.countByIsActive(true));
        summary.setInactiveEmployees(employeeRepository.countByIsActive(false));
        summary.setPendingEnrollments(employeeRepository.countByEnrollmentStatus(EnrollmentStatus.SUBMITTED));
        summary.setDraftEnrollments(employeeRepository.countByEnrollmentStatus(EnrollmentStatus.DRAFT));
        summary.setApprovedEnrollments(employeeRepository.countByEnrollmentStatus(EnrollmentStatus.APPROVED));

        // Department breakdown
        Map<String, Long> deptMap = new HashMap<>();
        List<Object[]> deptCounts = employeeRepository.countEmployeesByDepartment();
        for (Object[] row : deptCounts) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            deptMap.put(dept, count);
        }
        summary.setDepartmentBreakdown(deptMap);

        // Recent 5 enrollments
        List<EmployeeResponseDto> recent = employeeRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(EmployeeResponseDto::fromEntity)
                .collect(Collectors.toList());
        summary.setRecentEnrollments(recent);

        return summary;
    }
}
