const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.static(path.join(__dirname, '../'))); // serve index.html directly from Task 6 folder
app.use(express.json());

// Endpoint to Insert (Fires Trigger)
app.post('/api/insert-employee', (req, res) => {
    const { name, salary } = req.body;
    db.run("INSERT INTO Employees (name, department, salary) VALUES (?, 'Engineering', ?)", [name, salary], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Insertion triggered AuditLog automatically", id: this.lastID });
    });
});

// Endpoint to Update (Fires Trigger)
app.put('/api/update-employee', (req, res) => {
    const { id, salary } = req.body;
    db.run("UPDATE Employees SET salary = ? WHERE emp_id = ?", [salary, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Employee not found' });
        res.json({ success: true, message: "Update triggered AuditLog automatically" });
    });
});

// Endpoint to fetch AuditLog Table
app.get('/api/audit-log', (req, res) => {
    db.all("SELECT * FROM AuditLog ORDER BY action_timestamp DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Endpoint to fetch Daily Activity View
app.get('/api/daily-activity', (req, res) => {
    db.all("SELECT * FROM DailyActivityReport", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
