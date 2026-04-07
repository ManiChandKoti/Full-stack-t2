const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (stored in file)
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Initialize tables
        db.serialize(() => {
            // Customers Table
            db.run(`CREATE TABLE IF NOT EXISTS Customers (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE,
                registration_date DATE
            )`);

            // Products Table
            db.run(`CREATE TABLE IF NOT EXISTS Products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                category TEXT
            )`);

            // Orders Table
            db.run(`CREATE TABLE IF NOT EXISTS Orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER,
                product_id INTEGER,
                order_date DATE,
                quantity INTEGER,
                total_amount REAL,
                FOREIGN KEY(customer_id) REFERENCES Customers(customer_id),
                FOREIGN KEY(product_id) REFERENCES Products(product_id)
            )`);

            // Check if Customers exists, if not Seed dummy data
            db.get("SELECT COUNT(*) as count FROM Customers", (err, row) => {
                if (row.count === 0) {
                    console.log('Seeding data...');
                    const insertCustomer = db.prepare(`INSERT INTO Customers (first_name, last_name, email, registration_date) VALUES (?, ?, ?, ?)`);
                    insertCustomer.run("John", "Doe", "john.doe@example.com", "2023-01-15");
                    insertCustomer.run("Jane", "Smith", "jane.smith@example.com", "2023-02-20");
                    insertCustomer.run("Michael", "Johnson", "michael.j@example.com", "2023-03-10");
                    insertCustomer.finalize();

                    const insertProduct = db.prepare(`INSERT INTO Products (name, price, category) VALUES (?, ?, ?)`);
                    insertProduct.run("Laptop Pro", 1299.99, "Electronics");
                    insertProduct.run("Wireless Mouse", 49.99, "Accessories");
                    insertProduct.run("Ergonomic Chair", 249.50, "Furniture");
                    insertProduct.finalize();

                    const insertOrder = db.prepare(`INSERT INTO Orders (customer_id, product_id, order_date, quantity, total_amount) VALUES (?, ?, ?, ?, ?)`);
                    insertOrder.run(1, 1, "2023-05-10", 1, 1299.99); // John ordered Laptop
                    insertOrder.run(1, 2, "2023-05-12", 2, 99.98); // John ordered 2 Mice
                    insertOrder.run(2, 3, "2023-06-01", 1, 249.50); // Jane ordered Chair
                    insertOrder.run(3, 1, "2023-06-15", 2, 2599.98); // Michael ordered 2 Laptops (highest order)
                    insertOrder.run(1, 3, "2023-07-20", 1, 249.50); // John ordered Chair (Most active, 3 orders total)
                    insertOrder.finalize();
                    console.log('Seeding complete.');
                }
            });
        });
    }
});

module.exports = db;
