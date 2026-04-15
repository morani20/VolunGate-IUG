document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const btnChangeRole = document.getElementById('btn-change-role');
    const roleDropdown = document.getElementById('role-dropdown');
    const serviceBox = document.getElementById('service-box');

    // Dynamic Role Info Elements
    const selectedIcon = document.getElementById('selected-icon');
    const selectedTitle = document.getElementById('selected-title');
    const selectedDesc = document.getElementById('selected-desc');

    // Role Option List
    const roleOptions = document.querySelectorAll('.role-option');

    // Toggle dropdown visibility
    btnChangeRole.addEventListener('click', (e) => {
        e.stopPropagation();
        roleDropdown.classList.toggle('active');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!serviceBox.contains(e.target)) {
            roleDropdown.classList.remove('active');
        }
    });

    // Handle option selection
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active style from all options
            roleOptions.forEach(opt => opt.classList.remove('active'));

            // Set active style for clicked option
            option.classList.add('active');

            // Extract role data
            const title = option.getAttribute('data-title');
            const desc = option.getAttribute('data-desc');
            const iconClass = option.getAttribute('data-icon');

            // Update UI text
            selectedTitle.textContent = title;
            selectedDesc.textContent = desc;

            // Update UI icon
            selectedIcon.className = `fa-solid ${iconClass}`;

            // Hide dropdown
            roleDropdown.classList.remove('active');

            // Example: sessionStorage.setItem('user_role', option.getAttribute('data-role'));
        });
    });

    // Form Validation (Simulation for error UI)
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual submission

        // Simply display the error message as requested when the user clicks 'دخول' 
        // to show the exact error state they wanted.
        errorMessage.style.display = 'flex';

        // Optional: you can add logic here to only show it if values are wrong, 
        // but for now, it simulates the error whenever you try to log in.
    });
});
