package com.example.employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository {
    void save(Employee employee);
    Optional<Employee> findById(int id);
    List<Employee> findAll();
}
