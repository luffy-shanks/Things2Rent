document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen timeout
    setTimeout(() => {
        const splashScreen = document.getElementById('splash');
        if (splashScreen.classList.contains('active')) {
            nav('login');
        }
    }, 2000);

    // 2. Choice Chip logic
    const choiceChips = document.querySelectorAll('.choice');
    choiceChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            const siblings = e.target.parentElement.querySelectorAll('.choice');
            siblings.forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // 3. OTP Auto-advance
    const otpInputs = document.querySelectorAll('.otp-inputs input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});

// Global Navigation Function
function nav(targetScreenId) {
    // Determine active screen
    const currentScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(targetScreenId);

    if (!targetScreen) return;

    if (currentScreen) {
        currentScreen.classList.remove('active');
    }

    // Add active to target
    targetScreen.classList.add('active');

    // Dropdown menu reset on navigate
    closeMenu();

    // Special logic to reset OTP overlay if leaving signup
    if (targetScreenId !== 'signup') {
        closeOTP();
    }
}

// Side Menu Toggle Let
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

function closeMenu() {
    const menu = document.getElementById('dropdown-menu');
    if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
    }
}

// Global Toast helper
function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    if (!toast || !msg) return;
    
    msg.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// OTP Modal Triggers
function showOTP() {
    const emailInput = document.querySelector('#signup-form input[type="email"]');
    if (emailInput && !emailInput.value) {
        showToast('Please enter your email ID first to receive an OTP.');
        emailInput.focus();
        return;
    }

    const overlay = document.getElementById('otp-overlay');
    overlay.style.display = 'flex';
    document.querySelector('.otp-inputs input').focus();
    
    // Simulate OTP for demo
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const emailTo = emailInput ? emailInput.value : 'your email';
    showToast(`OTP sent to ${emailTo}: ${mockOtp}`, 5000);
    
    // Autofill mechanism logic (Wait for 1s to feel realistic then autofill)
    setTimeout(() => {
        const otpInputs = document.querySelectorAll('.otp-inputs input');
        otpInputs.forEach((input, index) => {
            input.value = mockOtp[index];
        });
        otpInputs[3].focus();
    }, 1500);
}

function closeOTP() {
    const overlay = document.getElementById('otp-overlay');
    overlay.style.display = 'none';
}

// OTP Validation Logic
function confirmOTP() {
    const inputs = document.querySelectorAll('.otp-inputs input');
    let valid = true;
    inputs.forEach(input => {
        if (!input.value) valid = false;
    });
    if (valid) {
        nav('home');
        closeOTP();
    } else {
        alert('Please enter all 4 digits of the OTP.');
    }
}

// Demo Flow Trigger for Searching Nearby
window.demoSuccessMode = true; // Deterministic toggle

function triggerSearch() {
    // Basic validation
    const qtyInput = document.querySelector('#emergency input[type="number"]');
    if (qtyInput && parseInt(qtyInput.value) < 1) {
        showToast('Quantity must be at least 1.', 3000);
        return;
    }
    
    document.getElementById('active-request-banner').style.display = 'flex';
    nav('searching');
    showToast('Searching for nearby suppliers...', 2000);
    
    // Hidden trigger to allow toggling demo mode easily
    const radar = document.querySelector('.radar-container');
    if (radar && !radar.dataset.listenerAdded) {
        radar.dataset.listenerAdded = 'true';
        radar.addEventListener('dblclick', () => {
            window.demoSuccessMode = !window.demoSuccessMode;
            showToast(`Demo Mode: ${window.demoSuccessMode ? 'Success' : 'Fail'}`, 2000);
        });
    }

    setTimeout(() => {
        if (window.demoSuccessMode) {
            nav('choose-supplier');
        } else {
            nav('no-response');
        }
    }, 3000);
}

// Act on incoming request
function acceptRequest(btn) {
    const card = btn.closest('.req-card');
    const allCards = document.querySelectorAll('#incoming-req .req-card');
    
    allCards.forEach(c => {
        if (c !== card) {
            c.style.opacity = '0.5';
            c.style.pointerEvents = 'none';
        }
    });

    btn.textContent = 'Accepted';
    btn.style.background = 'var(--success)';
    
    showToast('Request Accepted! Navigating...', 2000);
    setTimeout(() => {
        nav('live-track');
    }, 1500);
}

function cancelRequest() {
    document.getElementById('active-request-banner').style.display = 'none';
    showToast('Request cancelled.', 3000);
    nav('home');
}
