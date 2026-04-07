-- Task 4: Order Management using Joins
-- Concepts Used: Joins, Subqueries, ORDER BY

-- 1. Create Tables

CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    registration_date DATE
);

CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),
    category VARCHAR(50)
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    order_date DATE,
    quantity INT,
    total_amount DECIMAL(10, 2),
    FOREIGN KEY(customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY(product_id) REFERENCES Products(product_id)
);

-- ==========================================
-- 2. Display a customer order history using JOIN queries
-- ==========================================

SELECT 
    Orders.order_id,
    CONCAT(Customers.first_name, ' ', Customers.last_name) AS customer_name,
    Products.name AS product_name,
    Orders.order_date,
    Orders.quantity,
    Orders.total_amount
FROM Orders
JOIN Customers ON Orders.customer_id = Customers.customer_id
JOIN Products ON Orders.product_id = Products.product_id
ORDER BY Orders.order_date DESC;

-- ==========================================
-- 3. Subquery to find: Highest value order
-- ==========================================

SELECT 
    Orders.order_id, 
    CONCAT(Customers.first_name, ' ', Customers.last_name) AS customer_name,
    Orders.total_amount
FROM Orders
JOIN Customers ON Orders.customer_id = Customers.customer_id
WHERE Orders.total_amount = (
    SELECT MAX(total_amount) FROM Orders
);

-- ==========================================
-- 4. Subquery/Aggregation to find: Most active customer
-- ==========================================

SELECT 
    CONCAT(Customers.first_name, ' ', Customers.last_name) AS customer_name, 
    COUNT(Orders.order_id) as order_count
FROM Customers
JOIN Orders ON Customers.customer_id = Orders.customer_id
GROUP BY Customers.customer_id
ORDER BY order_count DESC
LIMIT 1;
