# Aysqo Technologies — Employee Enrollment System: REST API Documentation

This document specifies all REST API endpoints provided by the Spring Boot backend (`http://localhost:8080/api`).

---

## 1. Authentication & Session Management

### 1.1 Authenticate / Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "Admin@123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "token": "eyJhbGciOiJIUzUxMiJ9...",
      "tokenType": "Bearer",
      "user": {
        "id": 1,
        "username": "admin",
        "email": "admin@aysqo.com",
        "fullName": "Aysqo System Administrator",
        "role": "ADMIN"
      }
    },
    "timestamp": "2026-10-27T13:30:00"
  }
  ```
- **Error `401 Unauthorized`:**
  ```json
  {
    "success": false,
    "status": 401,
    "error": "Unauthorized",
    "message": "Invalid username or password"
  }
  ```

### 1.2 Sign Out / Logout
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Authenticated (or Public)
- **Response `200 OK`:** Clears `aysqo_token` HttpOnly cookie.

### 1.3 Current User Info
- **Endpoint:** `GET /api/auth/me`
- **Access:** Authenticated (Requires Bearer token or HttpOnly cookie)
- **Response `200 OK`:** Returns `UserSummaryDto`.

---

## 2. Employee Enrollment Management

### 2.1 Search & Paginate Employees
- **Endpoint:** `GET /api/employees`
- **Access:** Authenticated (`HR` or `ADMIN`)
- **Query Parameters:**
  - `search` *(optional)*: Substring match across employee ID, first name, last name, email.
  - `department` *(optional)*: Filter by department (e.g. `Engineering`, `Finance`, `Human Resources`).
  - `employmentType` *(optional)*: `Full-Time`, `Part-Time`, `Contract`, `Intern`.
  - `enrollmentStatus` *(optional)*: `Draft`, `Submitted`, `Approved`.
  - `active` *(optional)*: `true` or `false`.
  - `page` *(optional, default 0)*: Zero-based page index.
  - `size` *(optional, default 10)*: Number of items per page.
  - `sortBy` *(optional, default 'createdAt')*: Sort field.
  - `direction` *(optional, default 'desc')*: Sort direction (`asc` or `desc`).
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "content": [
        {
          "id": 1,
          "employeeId": "AYS-2026-0001",
          "firstName": "Alexander",
          "lastName": "Wright",
          "fullName": "Alexander Wright",
          "email": "alexander.wright@aysqo-demo.com",
          "phone": "+1-555-0101",
          "department": "Engineering",
          "jobTitle": "Principal Software Architect",
          "employmentType": "Full-Time",
          "joiningDate": "2026-01-15",
          "enrollmentStatus": "Approved",
          "isActive": true
        }
      ],
      "page": 0,
      "size": 10,
      "totalElements": 1,
      "totalPages": 1,
      "last": true
    }
  }
  ```

### 2.2 Create New Employee Enrollment
- **Endpoint:** `POST /api/employees`
- **Access:** Authenticated (`HR` or `ADMIN`)
- **Request Body:**
  ```json
  {
    "firstName": "Liam",
    "lastName": "Vance",
    "email": "liam.vance@aysqo-demo.com",
    "phone": "+1-555-0145",
    "dateOfBirth": "1994-06-15",
    "address": "504 Innovation Way, Suite 100, Austin, TX",
    "department": "Engineering",
    "jobTitle": "Senior Backend Engineer",
    "joiningDate": "2026-04-01",
    "employmentType": "Full-Time",
    "emergencyContactName": "Katherine Vance",
    "emergencyContactPhone": "+1-555-0988",
    "enrollmentStatus": "Submitted",
    "isActive": true
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Employee enrolled successfully",
    "data": {
      "id": 11,
      "employeeId": "AYS-2026-0011",
      "firstName": "Liam",
      "lastName": "Vance",
      "fullName": "Liam Vance",
      "email": "liam.vance@aysqo-demo.com",
      "enrollmentStatus": "Submitted",
      "isActive": true
    }
  }
  ```
- **Error `409 Conflict`:**
  ```json
  {
    "success": false,
    "status": 409,
    "error": "Conflict",
    "message": "An employee record with email 'liam.vance@aysqo-demo.com' already exists"
  }
  ```

### 2.3 Get Employee by ID
- **Endpoint:** `GET /api/employees/{id}`
- **Access:** Authenticated (`HR` or `ADMIN`)

### 2.4 Update Employee Record
- **Endpoint:** `PUT /api/employees/{id}`
- **Access:** Authenticated (`HR` or `ADMIN`)

### 2.5 Update Enrollment Status
- **Endpoint:** `PATCH /api/employees/{id}/status`
- **Access:** Authenticated (`HR` or `ADMIN`)
- **Request Body:**
  ```json
  {
    "status": "Approved"
  }
  ```

### 2.6 Toggle Active/Inactive Status
- **Endpoint:** `PATCH /api/employees/{id}/active`
- **Access:** Authenticated (`HR` or `ADMIN`)

### 2.7 Delete Employee Record
- **Endpoint:** `DELETE /api/employees/{id}`
- **Access:** Admin only (`hasRole('ADMIN')`)

---

## 3. Executive Dashboard & Metrics

### 3.1 Get Dashboard Statistics
- **Endpoint:** `GET /api/dashboard/summary`
- **Access:** Authenticated (`HR` or `ADMIN`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "totalEmployees": 10,
      "activeEmployees": 9,
      "inactiveEmployees": 1,
      "pendingEnrollments": 2,
      "draftEnrollments": 2,
      "approvedEnrollments": 6,
      "departmentBreakdown": {
        "Engineering": 4,
        "Human Resources": 1,
        "Product": 1,
        "Finance": 1,
        "Operations": 1,
        "Marketing": 1
      },
      "recentEnrollments": [...]
    }
  }
  ```

---

## 4. Actuator Health Monitoring

- **Endpoint:** `GET /actuator/health`
- **Access:** Public
- **Response `200 OK`:**
  ```json
  {
    "status": "UP"
  }
  ```
