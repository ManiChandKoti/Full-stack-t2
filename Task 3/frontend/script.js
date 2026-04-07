document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');

    const identifierError = document.getElementById('identifier-error');
    const passwordError = document.getElementById('password-error');
    const serverError = document.getElementById('server-error');

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    const isEmail = (str) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(str);
    };

    const clearErrors = () => {
        identifierError.classList.remove('show');
        passwordError.classList.remove('show');
        serverError.classList.remove('show');
        identifierInput.classList.remove('error-border');
        passwordInput.classList.remove('error-border');
    };

    const showError = (element, inputElement, message) => {
        element.textContent = message;
        element.classList.add('show');
        if (inputElement) {
            inputElement.classList.add('error-border');
        }
    };

    const validateForm = () => {
        let isValid = true;
        clearErrors();

        const identifierValue = identifierInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 1. Check empty fields
        if (identifierValue === '') {
            showError(identifierError, identifierInput, 'Please enter a username or email.');
            isValid = false;
        } else if (identifierValue.includes('@') && !isEmail(identifierValue)) {
            // Check valid email format only if it looks like they are trying to input an email
            showError(identifierError, identifierInput, 'Please enter a valid email address.');
            isValid = false;
        }

        if (passwordValue === '') {
            showError(passwordError, passwordInput, 'Please enter your password.');
            isValid = false;
        } else if (passwordValue.length < 6) {
            // Check minimum length
            showError(passwordError, passwordInput, 'Password must be at least 6 characters long.');
            isValid = false;
        }

        return isValid;
    };

    const setLoading = (isLoading) => {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const credentials = {
            identifier: identifierInput.value.trim(),
            password: passwordInput.value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                // If credentials are incorrect, it will send a message.
                showError(serverError, null, data.error || 'Invalid username or password');
            } else {
                // If correct, redirect to dashboard.
                window.location.href = data.redirect;
            }
        } catch (error) {
            showError(serverError, null, 'An error occurred connecting to the server.');
        } finally {
            setLoading(false);
        }
    });

    // Remove red borders upon typing
    [identifierInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error-border');
            serverError.classList.remove('show'); // Specially clear server errors on new typing
        });
    });
});
