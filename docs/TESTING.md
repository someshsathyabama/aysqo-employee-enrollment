# Aysqo Technologies — Employee Enrollment System: Testing Guide

This document covers automated testing execution, criteria verification, test suites, and results.

---

## 1. Automated Test Suites

The backend includes comprehensive JUnit 5 and Spring Boot integration tests verifying security, validation, database transactions, duplicate rejection, and CRUD operations.

| Test Class | Scope | Tests Run | Result |
| :--- | :--- | :---: | :---: |
| `AuthAndSecurityTests` | BCrypt hashing, JWT generation, login success, invalid password rejection (401), unauthorized endpoint denial, role-based access control (ADMIN vs HR permissions). | 6 | **PASS (100%)** |
| `EmployeeAndDashboardTests` | Employee creation, unique ID auto-generation (`AYS-YYYY-XXXX`), duplicate email conflict detection (409), required-field validation (400), search & pagination, ID retrieval, record updates, status transition, active toggle, dashboard summaries. | 9 | **PASS (100%)** |
| **Total Automated Tests** | **All layers** | **15** | **15 PASS / 0 FAIL** |

---

## 2. How to Run Backend Automated Tests

Run the following command from PowerShell:

```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\aysqo-employee-enrollment\backend
mvn clean test
```

### Verified Test Output
```text
[INFO] Running com.aysqo.enrollment.AuthAndSecurityTests
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0 -- in com.aysqo.enrollment.AuthAndSecurityTests
[INFO] Running com.aysqo.enrollment.EmployeeAndDashboardTests
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0 -- in com.aysqo.enrollment.EmployeeAndDashboardTests
[INFO] 
[INFO] Results:
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```

---

## 3. Manual Functional Verification Checklist

### 3.1 Authentication Workflow
- [x] Login with `admin` / `Admin@123` -> Navigates to `/dashboard`.
- [x] Login with `hr_manager` / `Hr@123` -> Navigates to `/dashboard`.
- [x] Login with invalid password -> Displays generic error banner: *"Invalid username or password"*.
- [x] Cookie verification -> `aysqo_token` HttpOnly cookie assigned.
- [x] Logout -> Clears session and redirects to `/login`.

### 3.2 Dashboard Workflow
- [x] Total headcount, active workforce, pending enrollments, and drafts display accurate numbers loaded from the backend.
- [x] Department breakdown shows distribution progress bars.
- [x] Recent enrollments table lists latest entries with direct link to details.
- [x] Refresh button re-queries `/api/dashboard/summary`.

### 3.3 Employee Directory & Search
- [x] Search by name, employee ID, or email filters dynamically with 400ms debounce.
- [x] Department filter isolates engineering, HR, marketing, etc.
- [x] Employment type filter isolates Full-Time, Part-Time, Contract, Intern.
- [x] Enrollment status filter isolates Draft, Submitted, Approved.
- [x] Server-side pagination and page-size selector (10, 20, 50).
- [x] Reset button clears all filters and restores default view.

### 3.4 Enrollment Form & Validation
- [x] Submitting blank required fields triggers field-specific error messages.
- [x] Email format and phone format validated on both client and server.
- [x] Re-using an existing email address triggers duplicate error banner (409 Conflict).
- [x] On successful submission, Confirmation Screen appears displaying the newly generated Employee ID with copy-to-clipboard button.

### 3.5 Status Changes & Active/Inactive Toggles
- [x] Transition status directly from Directory or Details page (Draft -> Submitted -> Approved).
- [x] Deactivate employee -> Opens confirmation modal. Upon confirmation, employee moves to Inactive archive.
- [x] Inactive archive -> Personnel can be reactivated back into active workforce.
