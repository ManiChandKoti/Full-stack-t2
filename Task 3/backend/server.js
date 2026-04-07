const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const database = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Please enter both username/email and password.' });
    }

    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    database.get(query, [identifier, identifier], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Send successful response with redirect URL
        res.status(200).json({ message: 'Login successful', redirect: '/dashboard.html' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
