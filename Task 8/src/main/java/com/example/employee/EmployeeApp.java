package com.example.employee;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class EmployeeApp {
    public static void main(String[] args) {
        // Use AnnotationConfigApplicationContext (implements BeanFactory)
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext("com.example.employee");
        BeanFactory factory = ctx; // treat context as BeanFactory to show IoC container usage

        EmployeeService service = factory.getBean(EmployeeService.class);

        // Add some employees
        service.addEmployee(new Employee(1, "Alice", "Developer"));
        service.addEmployee(new Employee(2, "Bob", "Manager"));

        System.out.println("All employees:");
        service.listEmployees().forEach(System.out::println);

        System.out.println("Get by id 2: " + service.getEmployee(2));

        ctx.close();
    }
}
