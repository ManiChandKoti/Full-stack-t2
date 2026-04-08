-- Task 6: Automated Logging using Triggers & Views
-- Features: A trigger that logs every INSERT or UPDATE, A view that shows daily activity reports.

-- ==========================================
-- 1. Setup Base Tables
-- ==========================================
CREATE TABLE Employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2)
);

CREATE TABLE AuditLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(10),  -- 'INSERT' or 'UPDATE'
    table_name VARCHAR(50),
    record_id INT,
    old_value TEXT,           -- For tracking old states in updates
    new_value TEXT,           -- For tracking new states
    action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. Create Triggers (INSERT and UPDATE)
-- ==========================================

-- Trigger for INSERTS
DELIMITER //
CREATE TRIGGER after_employee_insert
AFTER INSERT ON Employees
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (action_type, table_name, record_id, old_value, new_value)
    VALUES ('INSERT', 'Employees', NEW.emp_id, NULL, CONCAT('Name: ', NEW.name, ', Salary: ', NEW.salary));
END;
//
DELIMITER ;

-- Trigger for UPDATES
DELIMITER //
CREATE TRIGGER after_employee_update
AFTER UPDATE ON Employees
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (action_type, table_name, record_id, old_value, new_value)
    VALUES ('UPDATE', 'Employees', NEW.emp_id, CONCAT('Salary: ', OLD.salary), CONCAT('Salary: ', NEW.salary));
END;
//
DELIMITER ;

-- ==========================================
-- 3. Create a Daily Activity View
-- ==========================================

CREATE VIEW DailyActivityReport AS
SELECT 
    DATE(action_timestamp) AS activity_date,
    action_type,
    table_name,
    COUNT(*) AS total_actions
FROM AuditLog
GROUP BY DATE(action_timestamp), action_type, table_name
ORDER BY activity_date DESC;

-- ==========================================
-- Usage / Tests
-- ==========================================

-- Testing triggers:
INSERT INTO Employees (name, department, salary) VALUES ('Alice', 'Engineering', 85000);
INSERT INTO Employees (name, department, salary) VALUES ('Bob', 'HR', 60000);
UPDATE Employees SET salary = 90000 WHERE name = 'Alice';

-- Check the Daily View:
SELECT * FROM DailyActivityReport;
