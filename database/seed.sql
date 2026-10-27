-- =============================================================================
-- Aysqo Technologies - Employee Enrollment System
-- Synthetic Demo Seed Data (All records are fictional and for testing)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS aysqo_enrollment
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aysqo_enrollment;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Seed: users
-- Passwords:
--   admin      -> Admin@123
--   hr_manager -> Hr@123
-- -----------------------------------------------------------------------------
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES 
('admin', 'admin@aysqo.com', '$2a$10$DEG2SWXy2/fDTUCcVVAjRuzHDP2esEtDvPhbFg5Lugjj6wrb4GbBC', 'Aysqo System Administrator', 'ADMIN', TRUE),
('hr_manager', 'hr@aysqo.com', '$2a$10$SYVPMMXv9v00ThKlcEnvUOjjwjliIMEob9uo2NIKGxtFtJJYccpyW', 'Sarah Jenkins (HR Lead)', 'HR', TRUE)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    is_active = TRUE;

-- -----------------------------------------------------------------------------
-- Seed: employees (10 Synthetic Demonstration Records)
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO employees (
    employee_id, first_name, last_name, email, phone, date_of_birth, address,
    department, job_title, joining_date, employment_type,
    emergency_contact_name, emergency_contact_phone, enrollment_status, is_active
) VALUES
('AYS-2026-0001', 'Alexander', 'Wright', 'alexander.wright@aysqo-demo.com', '+1-555-0101', '1990-04-12', '124 Market Square, Suite 400, Austin, TX', 'Engineering', 'Principal Software Architect', '2026-01-15', 'Full-Time', 'Elena Wright', '+1-555-0191', 'Approved', TRUE),
('AYS-2026-0002', 'Sophia', 'Chen', 'sophia.chen@aysqo-demo.com', '+1-555-0102', '1993-08-23', '782 Silicon Ave, Apt 12B, San Jose, CA', 'Engineering', 'Senior Frontend Engineer', '2026-02-01', 'Full-Time', 'David Chen', '+1-555-0192', 'Approved', TRUE),
('AYS-2026-0003', 'Marcus', 'Vance', 'marcus.vance@aysqo-demo.com', '+1-555-0103', '1988-11-05', '45 Highland Terrace, Boston, MA', 'Product', 'Director of Product Management', '2026-02-15', 'Full-Time', 'Patricia Vance', '+1-555-0193', 'Approved', TRUE),
('AYS-2026-0004', 'Emily', 'Rodriguez', 'emily.rodriguez@aysqo-demo.com', '+1-555-0104', '1995-02-18', '330 Elm Street, Chicago, IL', 'Human Resources', 'HR Operations Specialist', '2026-03-01', 'Full-Time', 'Carlos Rodriguez', '+1-555-0194', 'Approved', TRUE),
('AYS-2026-0005', 'Tariq', 'Al-Mansoor', 'tariq.almansoor@aysqo-demo.com', '+1-555-0105', '1992-06-30', '901 Grand Boulevard, Seattle, WA', 'Engineering', 'DevOps & Cloud Engineer', '2026-03-10', 'Full-Time', 'Fatima Mansoor', '+1-555-0195', 'Approved', TRUE),
('AYS-2026-0006', 'Jessica', 'Taylor', 'jessica.taylor@aysqo-demo.com', '+1-555-0106', '1996-09-14', '512 Pinecrest Way, Denver, CO', 'Marketing', 'Content Strategy Manager', '2026-03-20', 'Full-Time', 'Robert Taylor', '+1-555-0196', 'Submitted', TRUE),
('AYS-2026-0007', 'Liam', 'OConnor', 'liam.oconnor@aysqo-demo.com', '+1-555-0107', '1998-12-04', '18 Beacon Hill Drive, New York, NY', 'Finance', 'Financial Analyst', '2026-04-01', 'Full-Time', 'Mary OConnor', '+1-555-0197', 'Submitted', TRUE),
('AYS-2026-0008', 'Aaliyah', 'Patel', 'aaliyah.patel@aysqo-demo.com', '+1-555-0108', '2001-05-19', '67 University Crescent, Atlanta, GA', 'Engineering', 'Junior Full-Stack Intern', '2026-04-10', 'Intern', 'Sunita Patel', '+1-555-0198', 'Draft', TRUE),
('AYS-2026-0009', 'Nathan', 'Brooks', 'nathan.brooks@aysqo-demo.com', '+1-555-0109', '1985-07-28', '204 Heritage Way, Dallas, TX', 'Operations', 'Supply Chain Consultant', '2026-04-15', 'Contract', 'Karen Brooks', '+1-555-0199', 'Draft', TRUE),
('AYS-2026-0010', 'Chloe', 'Dubois', 'chloe.dubois@aysqo-demo.com', '+1-555-0110', '1994-03-08', '405 Lakeshore Dr, Minneapolis, MN', 'Human Resources', 'Recruitment Coordinator', '2025-11-01', 'Part-Time', 'Pierre Dubois', '+1-555-0200', 'Approved', FALSE);

SET FOREIGN_KEY_CHECKS = 1;
