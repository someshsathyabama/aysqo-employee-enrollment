package com.aysqo.enrollment.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private long totalEmployees;
    private long activeEmployees;
    private long pendingEnrollments; // Submitted
    private long draftEnrollments;   // Draft
    private long approvedEnrollments; // Approved
    private long inactiveEmployees;
    private Map<String, Long> departmentBreakdown;
    private List<EmployeeResponseDto> recentEnrollments;

    public DashboardSummaryDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getPendingEnrollments() { return pendingEnrollments; }
    public void setPendingEnrollments(long pendingEnrollments) { this.pendingEnrollments = pendingEnrollments; }

    public long getDraftEnrollments() { return draftEnrollments; }
    public void setDraftEnrollments(long draftEnrollments) { this.draftEnrollments = draftEnrollments; }

    public long getApprovedEnrollments() { return approvedEnrollments; }
    public void setApprovedEnrollments(long approvedEnrollments) { this.approvedEnrollments = approvedEnrollments; }

    public long getInactiveEmployees() { return inactiveEmployees; }
    public void setInactiveEmployees(long inactiveEmployees) { this.inactiveEmployees = inactiveEmployees; }

    public Map<String, Long> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(Map<String, Long> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }

    public List<EmployeeResponseDto> getRecentEnrollments() { return recentEnrollments; }
    public void setRecentEnrollments(List<EmployeeResponseDto> recentEnrollments) { this.recentEnrollments = recentEnrollments; }
}
