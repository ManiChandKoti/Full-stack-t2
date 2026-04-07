const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = {
    get: (query, params, callback) => {
        pool.query(query, params, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.length > 0 ? results[0] : null);
        });
    }
};

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to XAMPP MySQL. Is XAMPP started? Message:', err.message);
    } else {
        console.log('Connected to XAMPP MySQL Database');
        connection.release();
    }
});

module.exports = db;
