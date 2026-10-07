const registerForm = document.querySelector('.registerForm');

let timeoutId;

function showMessage(type, message) {
    const messageBox = document.getElementById('showMessage');

    messageBox.textContent = message;
    messageBox.classList.remove('show', 'error', 'success');
    messageBox.classList.add(type, 'show');

    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const usernameValue = document.getElementById('username').value.trim();
    const passwordValue = document.getElementById('password').value;
    const emailValue = document.getElementById('email').value.trim();

    if (!usernameValue || !passwordValue || !emailValue) {
        showMessage('error', 'You must fill out all fields.');
        return;
    }

    if (usernameValue.length < 3) {
        showMessage('error', 'Username must be at least 3 characters.');
        return;
    }

    if (passwordValue.length < 8) {
        showMessage('error', 'Your password is too short (minimum 8 characters).');
        return;
    }

    if (!/[^A-Za-z0-9]/.test(passwordValue)) {
        showMessage('error', 'Please add at least one symbol (for example !, @, or #).');
        return;
    }

    if (userManager.checkUsername(usernameValue)) {
        showMessage('error', 'This username is already taken.');
        return;
    }

    const passwordHash = await hashPassword(passwordValue);

    const newUser = {
        username: usernameValue,
        passwordHash,
        email: emailValue,
        id: crypto.randomUUID(),
        role: 'user',
        failedLoginCount: 0,
        isLocked: false,
        lockedUntil: null,
        createdAt: new Date().toISOString()
    };

    userManager.addUser(newUser);
    registerForm.reset();
    showMessage('success', 'User registered successfully.');
});
