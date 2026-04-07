const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

connection.query('CREATE DATABASE IF NOT EXISTS login_system', (err) => {
    if (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }

    console.log('Database login_system ensured.');
    connection.query('USE login_system', (err) => {
        if (err) throw err;

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE,
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255)
            )
        `;

        connection.query(createTableQuery, (err) => {
            if (err) throw err;
            console.log('Users table ensured.');

            // Insert admin dummy only if they don't exist
            const checkQuery = `SELECT * FROM users WHERE username = 'admin'`;
            connection.query(checkQuery, (err, results) => {
                if (err) throw err;

                if (results.length === 0) {
                    const bcrypt = require('bcrypt');
                    const hash = bcrypt.hashSync('Password123!', 10);
                    const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
                    connection.query(insertQuery, ['admin', 'admin@example.com', hash], (err) => {
                        if (err) throw err;
                        console.log('Inserted dummy admin account in MySQL.');
                        process.exit(0);
                    });
                } else {
                    console.log('Admin account already exists.');
                    process.exit(0);
                }
            });
        });
    });
});
