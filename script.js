const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkdCnCyYt3HZexrPX_VfhvNmNvxPihafj2-NxVFZL1X9HgYU0kNgcElMF8YZ_ZIPpIkg/exec";

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function checkInviteCodeStatus() {
    const emailInput = document.getElementById("email");
    const searchBtn = document.getElementById("searchBtn");
    const resultDiv = document.getElementById("result");
    const captchaContainer = document.querySelector('.captcha-container');
    
    const email = emailInput.value.trim();
    
    // Reset previous results
    resultDiv.className = "";
    resultDiv.innerHTML = "";
    
    if (!email) {
        showError("請輸入電子郵件");
        return;
    }
    
    if (!validateEmail(email)) {
        showError("請輸入有效的電子郵件地址");
        return;
    }

    // Get hCaptcha response
    const hcaptchaResponse = hcaptcha.getResponse();
    if (!hcaptchaResponse) {
        showError("請完成驗證碼確認");
        return;
    }
    
    // Show loading state
    searchBtn.classList.add("loading");
    searchBtn.disabled = true;
    captchaContainer.classList.add('loading');
    
    try {
        const url = `${SCRIPT_URL}?action=checkStatus&email=${encodeURIComponent(email)}&captcha=${encodeURIComponent(hcaptchaResponse)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const icon = data.success ? 
            '<i class="bi bi-check-circle-fill result-icon"></i>' : 
            '<i class="bi bi-exclamation-circle-fill result-icon"></i>';
            
        resultDiv.innerHTML = `
            ${icon}
            <span class="result-message">${data.message}</span>
        `;
        resultDiv.className = data.success ? "success" : "error";
        setTimeout(() => resultDiv.classList.add('show'), 50);
    } catch (error) {
        showError("發生錯誤，請稍後再試。");
    } finally {
        // Reset loading state
        searchBtn.classList.remove("loading");
        searchBtn.disabled = false;
        captchaContainer.classList.remove('loading');
        // Reset hCaptcha
        hcaptcha.reset();
    }
}

function showError(message) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <i class="bi bi-exclamation-circle-fill result-icon"></i>
        <span class="result-message">${message}</span>
    `;
    resultDiv.className = "error";
    setTimeout(() => resultDiv.classList.add('show'), 50);
}

// Add enter key support
document.getElementById("email").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkInviteCodeStatus();
    }
});

// Add mobile menu toggle functionality
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!event.target.closest('.nav-links') && 
        !event.target.closest('.menu-toggle') && 
        navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});