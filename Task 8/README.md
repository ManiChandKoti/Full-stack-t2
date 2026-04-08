# Employee Management (Spring Core) — Simple Example

This small example demonstrates Inversion of Control (IoC) and Dependency Injection (DI) with Spring Core using annotations (`@Component`, `@Autowired`) and a `BeanFactory` reference to manage beans. Employee data is kept in-memory.

Build & run:

```bash
cd "c:/Users/DELL/Documents/TASKS FULL STACK/Task 8"
mvn -q package
java -cp target/employee-management-1.0-SNAPSHOT.jar;"%HOME%/.m2/repository/org/springframework/spring-context/5.3.27/spring-context-5.3.27.jar" com.example.employee.EmployeeApp
```

Alternatively run from your IDE (import as Maven project) and run `com.example.employee.EmployeeApp`.
