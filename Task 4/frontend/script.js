document.addEventListener('DOMContentLoaded', () => {

    // Hardcoded Dummy Data since there is no backend
    const highestOrder = {
        total_amount: 2599.98,
        order_id: 4,
        customer_name: 'Michael Johnson'
    };

    const activeCustomer = {
        customer_name: 'John Doe',
        order_count: 3
    };

    const history = [
        { order_id: 1, customer_name: 'John Doe', product_name: 'Laptop Pro', order_date: '2023-05-10', quantity: 1, total_amount: 1299.99 },
        { order_id: 2, customer_name: 'John Doe', product_name: 'Wireless Mouse', order_date: '2023-05-12', quantity: 2, total_amount: 99.98 },
        { order_id: 3, customer_name: 'Jane Smith', product_name: 'Ergonomic Chair', order_date: '2023-06-01', quantity: 1, total_amount: 249.50 },
        { order_id: 4, customer_name: 'Michael Johnson', product_name: 'Laptop Pro', order_date: '2023-06-15', quantity: 2, total_amount: 2599.98 },
        { order_id: 5, customer_name: 'John Doe', product_name: 'Ergonomic Chair', order_date: '2023-07-20', quantity: 1, total_amount: 249.50 }
    ];

    // 1. Update Highest Value Order Card
    document.getElementById('highest-order-value').textContent = `$${highestOrder.total_amount.toFixed(2)}`;
    document.getElementById('highest-order-user').textContent = `Order #${highestOrder.order_id} by ${highestOrder.customer_name}`;

    // 2. Update Most Active Customer Card
    document.getElementById('active-customer-name').textContent = activeCustomer.customer_name;
    document.getElementById('active-customer-count').textContent = `${activeCustomer.order_count} Orders Total`;

    // 3. Update History Table
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';

    history.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.style.animation = `fadeInUp 0.5s ease backwards`;
        tr.style.animationDelay = `${index * 0.1 + 0.5}s`;

        tr.innerHTML = `
            <td>#${order.order_id}</td>
            <td>${order.customer_name}</td>
            <td>${order.product_name}</td>
            <td>${new Date(order.order_date).toLocaleDateString()}</td>
            <td>${order.quantity}</td>
            <td>$${order.total_amount.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    // Hide overlay
    setTimeout(() => {
        document.getElementById('loader-overlay').classList.add('hidden');
    }, 800);

});
