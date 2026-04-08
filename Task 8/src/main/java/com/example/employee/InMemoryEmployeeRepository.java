package com.example.employee;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class InMemoryEmployeeRepository implements EmployeeRepository {
    private final Map<Integer, Employee> store = new LinkedHashMap<>();

    @Override
    public void save(Employee employee) {
        store.put(employee.getId(), employee);
    }

    @Override
    public Optional<Employee> findById(int id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public List<Employee> findAll() {
        return new ArrayList<>(store.values());
    }
}
