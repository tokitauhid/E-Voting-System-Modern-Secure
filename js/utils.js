/**
 * Utility functions for E-Voting System
 */

// --- Toast Notifications ---
class Toast {
    static show(message, type = 'info') {
        const container = document.getElementById('toast-container') || this.createContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.classList.add('show'));

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    static getIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}

// --- Storage Wrapper with Simulated Security ---
const Storage = {
    // Simulate simple hashing for passwords (NOT SECURE for real world, but better than plain text for this demo)
    hash: async (string) => {
        const msgBuffer = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    get: (key) => JSON.parse(localStorage.getItem(key)),
    
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    
    remove: (key) => localStorage.removeItem(key)
};

// --- Common UI Helpers ---
const UI = {
    setLoading: (btn, isLoading, originalText = 'Submit') => {
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    },

    togglePassword: (inputId, iconId) => {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
};
