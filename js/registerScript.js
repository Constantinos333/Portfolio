// 1. Initialize Global Variables
const userManager = {
    users: [],

    addUser(user) {
        this.users.push(user);
    },

    findUserByUsername(username) {
        return this.users.find((user) => user.username === username);
    },

    checkUsername(username) {
        return this.findUserByUsername(username) !== undefined;
    }
};

const registerForm = document.getElementById('registerForm');

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
registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Grab Values from inputs
    const usernameValue = document.getElementById('username').value.trim();
    const passwordValue = document.getElementById('password').value.trim();
    const emailValue = document.getElementById('email').value.trim();

    // --- VALIDATION LOGIC ---

    // Check if all fields are filled
    if (!usernameValue || !passwordValue || !emailValue) {
        showMessage('error', 'You must fill out all fields');
        return;
    }

    // Check username length
    if (usernameValue.length < 3) {
        showMessage('error', 'Username must be at least 3 characters');
        return;
    }

    // Check password length
    if (passwordValue.length < 8) {
        showMessage('error', 'Your password is too short (min. 8 characters).');
        return;
    }

    // Check for at least one symbol
    if (!/[^A-Za-z0-9]/.test(passwordValue)) {
        showMessage('error', 'Please add at least one symbol (e.g., !, @, #).');
        return;
    }

    //if username already exists in userManager: show error message, stop execution

    if (userManager.checkUsername(usernameValue)) {
        showMessage('error', 'This username is already taken');
        return;
    }

    // --- USER CREATION ---
    // If code reaches here, all validations passed!

    const newUser = {  //new User(usernameValue, passwordValue, emailValue) */ //This will be used once I leaern about classes in OOP JS
        username: usernameValue,
        password: passwordValue,
        email: emailValue,
        id: crypto.randomUUID(),
        role: 'user',
        failedLoginCount: 0,
        isLocked: false,
        lockedUntil: null,
        createdAt: new Date().toISOString()
    };

    // Push into our temporary database
    userManager.addUser(newUser);

    // Provide feedback
    console.log('Current users array:', userManager.users);
    console.log("Newly Created User:", newUser);

    // Reset the UI
    registerForm.reset();
    showMessage('success', 'User Registered Successfully!');
});
