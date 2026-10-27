-- =============================================================================
-- Aysqo Technologies - Employee Enrollment System
-- Database Schema Script (MySQL 8.x)
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- =============================================================================

CREATE DATABASE IF NOT EXISTS aysqo_enrollment
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aysqo_enrollment;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Holds authenticated application accounts (ADMIN and HR roles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'HR') NOT NULL DEFAULT 'HR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: employees
-- Holds employee enrollment master records
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    job_title VARCHAR(80) NOT NULL,
    joining_date DATE NOT NULL,
    employment_type ENUM('Full-Time', 'Part-Time', 'Contract', 'Intern') NOT NULL,
    emergency_contact_name VARCHAR(100) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    enrollment_status ENUM('Draft', 'Submitted', 'Approved') NOT NULL DEFAULT 'Draft',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_emp_employee_id (employee_id),
    INDEX idx_emp_email (email),
    INDEX idx_emp_department (department),
    INDEX idx_emp_employment_type (employment_type),
    INDEX idx_emp_status (enrollment_status),
    INDEX idx_emp_is_active (is_active),
    INDEX idx_emp_joining_date (joining_date),
    INDEX idx_emp_search_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
