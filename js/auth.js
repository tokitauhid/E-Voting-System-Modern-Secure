/**
 * Authentication Logic (Login & Register)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const isRegister = document.getElementById('registerForm');
    const isLogin = document.getElementById('loginForm');

    if (isRegister) {
        setupRegister();
    } else if (isLogin) {
        setupLogin();
    }
});

// --- Registration Logic ---
function setupRegister() {
    const form = document.getElementById('registerForm');
    const toggleBtn = document.getElementById('togglePassword');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => UI.togglePassword('password', 'toggleIcon'));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const voterId = document.getElementById('voterId').value.trim();
        const password = document.getElementById('password').value;
        const btn = form.querySelector('button[type="submit"]');

        // Validation
        if (!fullName || !voterId || !password) {
            Toast.show('All fields are required!', 'error');
            return;
        }

        if (voterId.length < 5) {
            Toast.show('Voter ID must be at least 5 characters.', 'warning');
            return;
        }

        if (password.length < 6) {
            Toast.show('Password must be at least 6 characters.', 'warning');
            return;
        }

        // Check if user exists
        const users = Storage.get('registeredUsers') || [];
        if (users.find(u => u.voterId === voterId)) {
            Toast.show('This Voter ID is already registered!', 'error');
            return;
        }

        // UI Loading State
        UI.setLoading(btn, true);

        // Simulate Network Delay & Hashing
        setTimeout(async () => {
            const hashedPassword = await Storage.hash(password);

            users.push({
                fullName,
                voterId,
                password: hashedPassword,
                hasVoted: false,
                registeredAt: new Date().toISOString()
            });

            Storage.set('registeredUsers', users);

            UI.setLoading(btn, false);
            Toast.show('Registration Successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }, 1500);
    });
}

// --- Login Logic ---
function setupLogin() {
    const form = document.getElementById('loginForm');
    const toggleBtn = document.getElementById('togglePassword');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => UI.togglePassword('password', 'toggleIcon'));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const voterId = document.getElementById('voterId').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const btn = form.querySelector('button[type="submit"]');

        if (!voterId || !password) {
            Toast.show('Please fill in all fields.', 'error');
            return;
        }

        UI.setLoading(btn, true, 'Sign In');

        setTimeout(async () => {
            const users = Storage.get('registeredUsers') || [];
            const hashedPassword = await Storage.hash(password);

            const user = users.find(u => u.voterId === voterId && u.password === hashedPassword);

            if (user) {
                // Set Session
                Storage.set('voterUser', voterId); // In real app, use a token

                // Simulate "Remember Me" (for demo, just console log or logic placeholder)
                if (remember) {
                    localStorage.setItem('rememberVoter', voterId);
                } else {
                    localStorage.removeItem('rememberVoter');
                }

                UI.setLoading(btn, false, 'Sign In');
                Toast.show('Login Successful!', 'success');

                setTimeout(() => {
                    window.location.href = 'voter_dashboard.html';
                }, 500);
            } else {
                UI.setLoading(btn, false, 'Sign In');
                Toast.show('Invalid Credentials!', 'error');
            }
        }, 1000);
    });
}
