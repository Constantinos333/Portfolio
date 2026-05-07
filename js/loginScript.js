const loginForm = document.getElementById('loginForm');

let timeoutId;

/**
 * Displays feedback messages to the user
 * @param {string} type - 'error' or 'success'
 * @param {string} message - The text to display
 */

function showMessage(type, message) {
    const messageBox = document.getElementById("showMessage"); // Fixed: Added quotes

    messageBox.textContent = message;

    // Reset and apply new styles
    messageBox.classList.remove('show', 'error', 'success');
    messageBox.classList.add(type, 'show');

    // Clear previous timer if user clicks rapidly
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Auto-hide after 3 seconds
    timeoutId = setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

// 2. Main Event Listener
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Grab Values from inputs
    const usernameValue = document.getElementById('username').value.trim();
    const passwordValue = document.getElementById('password').value.trim();


    // --- VALIDATION LOGIC ---

    // 0. Fill all fields
    if (!usernameValue || !passwordValue) {
        showMessage('error', 'You must fill out all fields!');
        return;
    }

    // 1. Find the user in your userManager
    const user = userManager.findUserByUsername(usernameValue);

    // 2. Check if user exists
    if (!user) {
        showMessage('error', 'User does not exist');
        return;
    }

    // 3. Check if password matches
    if (user.password !== passwordValue || user.username !== usernameValue) {
        showMessage('error', 'Incorrect username or password');
        return;
    }

    // 4. Reset UI
    showMessage('success', 'Welcome back, ' + user.username);
    loginForm.reset();

});