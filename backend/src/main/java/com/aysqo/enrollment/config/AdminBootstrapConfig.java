package com.aysqo.enrollment.config;

import com.aysqo.enrollment.entity.*;
import com.aysqo.enrollment.repository.EmployeeRepository;
import com.aysqo.enrollment.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class AdminBootstrapConfig implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapConfig.class);

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username:admin}")
    private String adminUsername;

    @Value("${app.admin.default-email:admin@aysqo.com}")
    private String adminEmail;

    @Value("${app.admin.default-password:Admin@123}")
    private String adminPassword;

    @Value("${app.hr.default-username:hr_manager}")
    private String hrUsername;

    @Value("${app.hr.default-email:hr@aysqo.com}")
    private String hrEmail;

    @Value("${app.hr.default-password:Hr@123}")
    private String hrPassword;

    public AdminBootstrapConfig(UserRepository userRepository,
                                EmployeeRepository employeeRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        bootstrapUsers();
        bootstrapSyntheticEmployees();
    }

    private void bootstrapUsers() {
        // Bootstrap or Synchronize Administrator
        User admin = userRepository.findByUsername(adminUsername)
                .or(() -> userRepository.findByEmail(adminEmail))
                .orElse(null);

        if (admin == null) {
            admin = new User(
                    adminUsername,
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    "Aysqo System Administrator",
                    Role.ADMIN,
                    true
            );
            userRepository.save(admin);
            logger.info("Bootstrap: Initial Administrator account created: [{}]", adminUsername);
        } else {
            // Always synchronize password to guarantee login works regardless of prior seed scripts
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
            logger.info("Bootstrap: Synchronized password for Administrator account [{}]", adminUsername);
        }

        // Bootstrap or Synchronize HR Manager
        User hr = userRepository.findByUsername(hrUsername)
                .or(() -> userRepository.findByEmail(hrEmail))
                .orElse(null);

        if (hr == null) {
            hr = new User(
                    hrUsername,
                    hrEmail,
                    passwordEncoder.encode(hrPassword),
                    "Sarah Jenkins (HR Lead)",
                    Role.HR,
                    true
            );
            userRepository.save(hr);
            logger.info("Bootstrap: Initial HR Manager account created: [{}]", hrUsername);
        } else {
            hr.setUsername(hrUsername);
            hr.setEmail(hrEmail);
            hr.setPasswordHash(passwordEncoder.encode(hrPassword));
            hr.setRole(Role.HR);
            hr.setIsActive(true);
            userRepository.save(hr);
            logger.info("Bootstrap: Synchronized password for HR Manager account [{}]", hrUsername);
        }
    }

    private void bootstrapSyntheticEmployees() {
        if (employeeRepository.count() > 0) {
            return;
        }

        logger.info("Bootstrap: Seeding initial synthetic demonstration employees...");

        List<Employee> demoEmployees = List.of(
                createDemoEmployee("AYS-2026-0001", "Alexander", "Wright", "alexander.wright@aysqo-demo.com",
                        "+1-555-0101", LocalDate.of(1990, 4, 12), "124 Market Square, Suite 400, Austin, TX",
                        "Engineering", "Principal Software Architect", LocalDate.of(2026, 1, 15),
                        EmploymentType.FULL_TIME, "Elena Wright", "+1-555-0191", EnrollmentStatus.APPROVED, true),

                createDemoEmployee("AYS-2026-0002", "Sophia", "Chen", "sophia.chen@aysqo-demo.com",
                        "+1-555-0102", LocalDate.of(1993, 8, 23), "782 Silicon Ave, Apt 12B, San Jose, CA",
                        "Engineering", "Senior Frontend Engineer", LocalDate.of(2026, 2, 1),
                        EmploymentType.FULL_TIME, "David Chen", "+1-555-0192", EnrollmentStatus.APPROVED, true),

                createDemoEmployee("AYS-2026-0003", "Marcus", "Vance", "marcus.vance@aysqo-demo.com",
                        "+1-555-0103", LocalDate.of(1988, 11, 5), "45 Highland Terrace, Boston, MA",
                        "Product", "Director of Product Management", LocalDate.of(2026, 2, 15),
                        EmploymentType.FULL_TIME, "Patricia Vance", "+1-555-0193", EnrollmentStatus.APPROVED, true),

                createDemoEmployee("AYS-2026-0004", "Emily", "Rodriguez", "emily.rodriguez@aysqo-demo.com",
                        "+1-555-0104", LocalDate.of(1995, 2, 18), "330 Elm Street, Chicago, IL",
                        "Human Resources", "HR Operations Specialist", LocalDate.of(2026, 3, 1),
                        EmploymentType.FULL_TIME, "Carlos Rodriguez", "+1-555-0194", EnrollmentStatus.APPROVED, true),

                createDemoEmployee("AYS-2026-0005", "Tariq", "Al-Mansoor", "tariq.almansoor@aysqo-demo.com",
                        "+1-555-0105", LocalDate.of(1992, 6, 30), "901 Grand Boulevard, Seattle, WA",
                        "Engineering", "DevOps & Cloud Engineer", LocalDate.of(2026, 3, 10),
                        EmploymentType.FULL_TIME, "Fatima Mansoor", "+1-555-0195", EnrollmentStatus.APPROVED, true),

                createDemoEmployee("AYS-2026-0006", "Jessica", "Taylor", "jessica.taylor@aysqo-demo.com",
                        "+1-555-0106", LocalDate.of(1996, 9, 14), "512 Pinecrest Way, Denver, CO",
                        "Marketing", "Content Strategy Manager", LocalDate.of(2026, 3, 20),
                        EmploymentType.FULL_TIME, "Robert Taylor", "+1-555-0196", EnrollmentStatus.SUBMITTED, true),

                createDemoEmployee("AYS-2026-0007", "Liam", "O'Connor", "liam.oconnor@aysqo-demo.com",
                        "+1-555-0107", LocalDate.of(1998, 12, 4), "18 Beacon Hill Drive, New York, NY",
                        "Finance", "Financial Analyst", LocalDate.of(2026, 4, 1),
                        EmploymentType.FULL_TIME, "Mary O'Connor", "+1-555-0197", EnrollmentStatus.SUBMITTED, true),

                createDemoEmployee("AYS-2026-0008", "Aaliyah", "Patel", "aaliyah.patel@aysqo-demo.com",
                        "+1-555-0108", LocalDate.of(2001, 5, 19), "67 University Crescent, Atlanta, GA",
                        "Engineering", "Junior Full-Stack Intern", LocalDate.of(2026, 4, 10),
                        EmploymentType.INTERN, "Sunita Patel", "+1-555-0198", EnrollmentStatus.DRAFT, true),

                createDemoEmployee("AYS-2026-0009", "Nathan", "Brooks", "nathan.brooks@aysqo-demo.com",
                        "+1-555-0109", LocalDate.of(1985, 7, 28), "204 Heritage Way, Dallas, TX",
                        "Operations", "Supply Chain Consultant", LocalDate.of(2026, 4, 15),
                        EmploymentType.CONTRACT, "Karen Brooks", "+1-555-0199", EnrollmentStatus.DRAFT, true),

                createDemoEmployee("AYS-2026-0010", "Chloe", "Dubois", "chloe.dubois@aysqo-demo.com",
                        "+1-555-0110", LocalDate.of(1994, 3, 8), "405 Lakeshore Dr, Minneapolis, MN",
                        "Human Resources", "Recruitment Coordinator", LocalDate.of(2025, 11, 1),
                        EmploymentType.PART_TIME, "Pierre Dubois", "+1-555-0200", EnrollmentStatus.APPROVED, false)
        );

        employeeRepository.saveAll(demoEmployees);
        logger.info("Bootstrap: Successfully loaded {} synthetic demonstration employee records.", demoEmployees.size());
    }

    private Employee createDemoEmployee(String empId, String first, String last, String email,
                                       String phone, LocalDate dob, String address, String dept,
                                       String title, LocalDate joined, EmploymentType type,
                                       String emName, String emPhone, EnrollmentStatus status, boolean active) {
        Employee e = new Employee();
        e.setEmployeeId(empId);
        e.setFirstName(first);
        e.setLastName(last);
        e.setEmail(email);
        e.setPhone(phone);
        e.setDateOfBirth(dob);
        e.setAddress(address);
        e.setDepartment(dept);
        e.setJobTitle(title);
        e.setJoiningDate(joined);
        e.setEmploymentType(type);
        e.setEmergencyContactName(emName);
        e.setEmergencyContactPhone(emPhone);
        e.setEnrollmentStatus(status);
        e.setIsActive(active);
        return e;
    }
}
