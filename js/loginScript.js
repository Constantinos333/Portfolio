const loginForm = document.getElementById('loginForm');

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

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const usernameValue = document.getElementById('username').value.trim();
    const passwordValue = document.getElementById('password').value;

    if (!usernameValue || !passwordValue) {
        showMessage('error', 'You must fill out all fields.');
        return;
    }

    const user = userManager.findUserByUsername(usernameValue);

    if (!user) {
        showMessage('error', 'Incorrect username or password.');
        return;
    }

    const passwordHash = await hashPassword(passwordValue);

    if (user.passwordHash !== passwordHash) {
        showMessage('error', 'Incorrect username or password.');
        return;
    }

    showMessage('success', 'Welcome back, ' + user.username);
    loginForm.reset();
});
