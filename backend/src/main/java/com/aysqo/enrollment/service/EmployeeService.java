package com.aysqo.enrollment.service;

import com.aysqo.enrollment.dto.EmployeeRequestDto;
import com.aysqo.enrollment.dto.EmployeeResponseDto;
import com.aysqo.enrollment.dto.PagedResponse;
import com.aysqo.enrollment.entity.Employee;
import com.aysqo.enrollment.entity.EmploymentType;
import com.aysqo.enrollment.entity.EnrollmentStatus;
import com.aysqo.enrollment.exception.DuplicateResourceException;
import com.aysqo.enrollment.exception.ResourceNotFoundException;
import com.aysqo.enrollment.repository.EmployeeRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeIdGeneratorService idGeneratorService;

    public EmployeeService(EmployeeRepository employeeRepository, EmployeeIdGeneratorService idGeneratorService) {
        this.employeeRepository = employeeRepository;
        this.idGeneratorService = idGeneratorService;
    }

    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeRequestDto dto) {
        String normalizedEmail = dto.getEmail().trim().toLowerCase();
        if (employeeRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An employee record with email '" + dto.getEmail() + "' already exists");
        }

        String generatedId = idGeneratorService.generateNextEmployeeId();

        Employee emp = new Employee();
        emp.setEmployeeId(generatedId);
        emp.setFirstName(dto.getFirstName().trim());
        emp.setLastName(dto.getLastName().trim());
        emp.setEmail(normalizedEmail);
        emp.setPhone(dto.getPhone().trim());
        emp.setDateOfBirth(dto.getDateOfBirth());
        emp.setAddress(dto.getAddress().trim());
        emp.setDepartment(dto.getDepartment().trim());
        emp.setJobTitle(dto.getJobTitle().trim());
        emp.setJoiningDate(dto.getJoiningDate());
        emp.setEmploymentType(dto.getEmploymentType());
        emp.setEmergencyContactName(dto.getEmergencyContactName().trim());
        emp.setEmergencyContactPhone(dto.getEmergencyContactPhone().trim());
        emp.setEnrollmentStatus(dto.getEnrollmentStatus() != null ? dto.getEnrollmentStatus() : EnrollmentStatus.DRAFT);
        emp.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        Employee saved = employeeRepository.save(emp);
        return EmployeeResponseDto.fromEntity(saved);
    }

    @Transactional
    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto dto) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        String normalizedEmail = dto.getEmail().trim().toLowerCase();
        if (employeeRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
            throw new DuplicateResourceException("An employee record with email '" + dto.getEmail() + "' already exists");
        }

        emp.setFirstName(dto.getFirstName().trim());
        emp.setLastName(dto.getLastName().trim());
        emp.setEmail(normalizedEmail);
        emp.setPhone(dto.getPhone().trim());
        emp.setDateOfBirth(dto.getDateOfBirth());
        emp.setAddress(dto.getAddress().trim());
        emp.setDepartment(dto.getDepartment().trim());
        emp.setJobTitle(dto.getJobTitle().trim());
        emp.setJoiningDate(dto.getJoiningDate());
        emp.setEmploymentType(dto.getEmploymentType());
        emp.setEmergencyContactName(dto.getEmergencyContactName().trim());
        emp.setEmergencyContactPhone(dto.getEmergencyContactPhone().trim());
        if (dto.getEnrollmentStatus() != null) {
            emp.setEnrollmentStatus(dto.getEnrollmentStatus());
        }
        if (dto.getIsActive() != null) {
            emp.setIsActive(dto.getIsActive());
        }

        Employee updated = employeeRepository.save(emp);
        return EmployeeResponseDto.fromEntity(updated);
    }

    @Transactional
    public EmployeeResponseDto updateEnrollmentStatus(Long id, EnrollmentStatus status) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        emp.setEnrollmentStatus(status);
        Employee updated = employeeRepository.save(emp);
        return EmployeeResponseDto.fromEntity(updated);
    }

    @Transactional
    public EmployeeResponseDto toggleActiveStatus(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        emp.setIsActive(!emp.getIsActive());
        Employee updated = employeeRepository.save(emp);
        return EmployeeResponseDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return EmployeeResponseDto.fromEntity(emp);
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDto getEmployeeByEmployeeId(String employeeId) {
        Employee emp = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with employee ID: " + employeeId));
        return EmployeeResponseDto.fromEntity(emp);
    }

    @Transactional(readOnly = true)
    public PagedResponse<EmployeeResponseDto> searchEmployees(
            String search,
            String department,
            EmploymentType employmentType,
            EnrollmentStatus enrollmentStatus,
            Boolean isActive,
            Pageable pageable) {

        Specification<Employee> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate idPredicate = cb.like(cb.lower(root.get("employeeId")), searchPattern);
                Predicate firstPredicate = cb.like(cb.lower(root.get("firstName")), searchPattern);
                Predicate lastPredicate = cb.like(cb.lower(root.get("lastName")), searchPattern);
                Predicate emailPredicate = cb.like(cb.lower(root.get("email")), searchPattern);
                predicates.add(cb.or(idPredicate, firstPredicate, lastPredicate, emailPredicate));
            }

            if (StringUtils.hasText(department)) {
                predicates.add(cb.equal(cb.lower(root.get("department")), department.trim().toLowerCase()));
            }

            if (employmentType != null) {
                predicates.add(cb.equal(root.get("employmentType"), employmentType));
            }

            if (enrollmentStatus != null) {
                predicates.add(cb.equal(root.get("enrollmentStatus"), enrollmentStatus));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Employee> page = employeeRepository.findAll(spec, pageable);
        List<EmployeeResponseDto> content = page.getContent().stream()
                .map(EmployeeResponseDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }
}
