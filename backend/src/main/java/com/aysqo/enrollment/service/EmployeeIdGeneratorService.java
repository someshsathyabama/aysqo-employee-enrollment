package com.aysqo.enrollment.service;

import com.aysqo.enrollment.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class EmployeeIdGeneratorService {

    private final EmployeeRepository employeeRepository;
    private final AtomicLong sequence = new AtomicLong(0);

    public EmployeeIdGeneratorService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public synchronized String generateNextEmployeeId() {
        int currentYear = Year.now().getValue();
        long count = employeeRepository.count();
        long nextVal = count + 1;

        String candidateId;
        do {
            candidateId = String.format("AYS-%d-%04d", currentYear, nextVal++);
        } while (employeeRepository.existsByEmployeeId(candidateId));

        return candidateId;
    }
}
