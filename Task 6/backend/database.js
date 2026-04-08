const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'audit.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite logging database.');

        db.serialize(() => {
            // Enable Foreign Keys (not strictly needed but good practice)
            db.run("PRAGMA foreign_keys = ON;");

            // 1. Setup Base Tables
            db.run(`CREATE TABLE IF NOT EXISTS Employees (
                emp_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                department TEXT,
                salary REAL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS AuditLog (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                action_type TEXT,
                table_name TEXT,
                record_id INTEGER,
                old_value TEXT,
                new_value TEXT,
                action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 2. Create Triggers (SQLite syntax)
            // AFTER INSERT Trigger
            db.run(`CREATE TRIGGER IF NOT EXISTS after_employee_insert
                    AFTER INSERT ON Employees
                    BEGIN
                        INSERT INTO AuditLog (action_type, table_name, record_id, old_value, new_value)
                        VALUES ('INSERT', 'Employees', NEW.emp_id, 'NULL', 'Name: ' || NEW.name || ', Salary: ' || NEW.salary);
                    END;`);

            // AFTER UPDATE Trigger
            db.run(`CREATE TRIGGER IF NOT EXISTS after_employee_update
                    AFTER UPDATE ON Employees
                    BEGIN
                        INSERT INTO AuditLog (action_type, table_name, record_id, old_value, new_value)
                        VALUES ('UPDATE', 'Employees', NEW.emp_id, 'Sal: ' || OLD.salary, 'Sal: ' || NEW.salary);
                    END;`);

            // 3. Create Daily Activity View
            // SQLite date() function extracts the date part
            db.run(`CREATE VIEW IF NOT EXISTS DailyActivityReport AS
                    SELECT 
                        date(action_timestamp) AS activity_date,
                        action_type,
                        table_name,
                        COUNT(*) AS total_actions
                    FROM AuditLog
                    GROUP BY date(action_timestamp), action_type, table_name
                    ORDER BY activity_date DESC;`);
        });
    }
});

module.exports = db;
