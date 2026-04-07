const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// 1. Display a customer order history using JOIN queries
app.get('/api/history', (req, res) => {
    const query = `
        SELECT 
            Orders.order_id,
            Customers.first_name || ' ' || Customers.last_name AS customer_name,
            Products.name AS product_name,
            Orders.order_date,
            Orders.quantity,
            Orders.total_amount
        FROM Orders
        JOIN Customers ON Orders.customer_id = Customers.customer_id
        JOIN Products ON Orders.product_id = Products.product_id
        ORDER BY Orders.order_date DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows, query });
    });
});

// 2. Subquery to find: Highest value order
app.get('/api/highest-order', (req, res) => {
    const query = `
        SELECT 
            Orders.order_id, 
            Customers.first_name || ' ' || Customers.last_name AS customer_name,
            Orders.total_amount
        FROM Orders
        JOIN Customers ON Orders.customer_id = Customers.customer_id
        WHERE Orders.total_amount = (SELECT MAX(total_amount) FROM Orders)
    `;
    db.get(query, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: row, query });
    });
});

// 3. Subquery to find: Most active customer (highest number of orders)
app.get('/api/most-active', (req, res) => {
    // using a subquery to find maximum count or a simple group by limit 1
    const query = `
        SELECT Customers.first_name || ' ' || Customers.last_name AS customer_name, COUNT(Orders.order_id) as order_count
        FROM Customers
        JOIN Orders ON Customers.customer_id = Orders.customer_id
        GROUP BY Customers.customer_id
        ORDER BY order_count DESC
        LIMIT 1
    `;
    db.get(query, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: row, query });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
