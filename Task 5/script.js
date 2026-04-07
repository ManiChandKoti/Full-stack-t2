document.addEventListener('DOMContentLoaded', () => {
    let userBalance = 5000.00;
    let merchantBalance = 10000.00;

    const userBalanceEl = document.getElementById('user-balance');
    const merchantBalanceEl = document.getElementById('merchant-balance');
    const amountInput = document.getElementById('amount');
    const simulateFailCheck = document.getElementById('fail-simulation');
    const transferBtn = document.getElementById('transfer-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const logList = document.getElementById('log-list');

    const formatCurrency = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const updateBalancesUI = () => {
        userBalanceEl.textContent = formatCurrency(userBalance);
        merchantBalanceEl.textContent = formatCurrency(merchantBalance);
    };

    const addLog = (message, color = '#fff') => {
        const li = document.createElement('li');
        li.style.color = color;
        li.textContent = `[${new Date().toLocaleTimeString()}] - ${message}`;
        logList.appendChild(li);
        logList.parentElement.scrollTop = logList.parentElement.scrollHeight;
    };

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const transferAmount = parseFloat(amountInput.value);
        if (isNaN(transferAmount) || transferAmount <= 0) return;

        if (transferAmount > userBalance) {
            addLog(`Error: Insufficient funds in user account.`, '#ff5252');
            return;
        }

        const willFail = simulateFailCheck.checked;

        // Disable UI
        transferBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');

        // Initial SQL step
        addLog(`Executing: START TRANSACTION;`, '#00d2ff');

        setTimeout(() => {
            // Deduct
            userBalance -= transferAmount;
            updateBalancesUI();
            addLog(`Executing: UPDATE accounts SET balance = balance - ${transferAmount} WHERE id = 'user';`, '#00d2ff');

            setTimeout(() => {
                if (willFail) {
                    // Simulate network failure
                    addLog(`CRITICAL ERROR: Connection to Payment Gateway Lost!`, '#ff5252');
                    addLog(`Executing: ROLLBACK;`, '#ff5252');

                    // Revert balance
                    userBalance += transferAmount;
                    updateBalancesUI();

                    addLog(`Transaction Rolled Back. Funds restored safely.`, '#b0c4de');
                } else {
                    // Success Step
                    merchantBalance += transferAmount;
                    updateBalancesUI();
                    addLog(`Executing: UPDATE accounts SET balance = balance + ${transferAmount} WHERE id = 'merchant';`, '#00d2ff');

                    addLog(`Executing: COMMIT;`, '#00e676');
                    amountInput.value = ''; // clear input
                }

                // Enable UI
                transferBtn.disabled = false;
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');

            }, 1000); // Merchant update delay

        }, 1000); // User deduct delay

    });
});
