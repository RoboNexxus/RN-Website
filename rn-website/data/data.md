css

/* Toast Notification Styles */
.toast-container {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast {
    background: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 350px;
    max-width: 500px;
    pointer-events: auto;
    animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(10px);
}

.toast.toast-exit {
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
}

.toast-success {
    border-left: 3px solid #10b981;
}

.toast-error {
    border-left: 3px solid #ef4444;
}

.toast-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
}

.toast-icon svg {
    width: 100%;
    height: 100%;
}

.toast-success .toast-icon {
    color: #10b981;
}

.toast-error .toast-icon {
    color: #ef4444;
}

.toast-content {
    flex: 1;
}

.toast-title {
    font-weight: 600;
    font-size: 14px;
    color: #f9fafb;
    margin: 0 0 4px 0;
}

.toast-description {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
    line-height: 1.5;
}

.toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
    border-radius: 4px;
}

.toast-close:hover {
    color: #d1d5db;
    background: rgba(255, 255, 255, 0.05);
}

/* Animations */
@keyframes slideDown {
    from {
        transform: translateY(-120%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-120%);
        opacity: 0;
    }
}

/* Mobile responsive */
@media (max-width: 640px) {
    .toast {
        min-width: calc(100vw - 40px);
        max-width: calc(100vw - 40px);
    }
}


JS
// Toast Notification System
class Toast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    show(options) {
        const {
            type = 'success',
            title = '',
            description = '',
            duration = 4242
        } = options;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Icon SVG
        const iconSVG = type === 'success' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

        toast.innerHTML = `
            <div class="toast-icon">
                ${iconSVG}
            </div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                ${description ? `<div class="toast-description">${description}</div>` : ''}
            </div>
            <button class="toast-close" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Add to container
        this.container.appendChild(toast);

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.dismiss(toast));

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }

        return toast;
    }

    dismiss(toast) {
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    success(title, description, duration) {
        return this.show({ type: 'success', title, description, duration });
    }

    error(title, description, duration) {
        return this.show({ type: 'error', title, description, duration });
    }
}

// Create global toast instance
window.toast = new Toast();