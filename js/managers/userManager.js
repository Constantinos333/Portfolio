// Educational client-side state manager.
//
// SECURITY NOTE:
// This remains a browser-only learning prototype, not production authentication.
// Real authentication should use a trusted server/auth provider, salted password hashing,
// secure session management, rate limiting, and server-side authorization.

const userManager = {
    users: JSON.parse(localStorage.getItem('users')) || [],

    addUser(user) {
        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
    },

    getAllUsers() {
        return [...this.users];
    },

    findUserByUsername(username) {
        return this.users.find((user) => user.username === username);
    },

    checkUsername(username) {
        return this.findUserByUsername(username) !== undefined;
    },

    findUserById(id) {
        return this.users.find((user) => user.id === id);
    },

    updateUser(id, updates) {
        this.users = this.users.map((user) => {
            if (user.id === id) {
                return { ...user, ...updates, id: user.id, createdAt: user.createdAt };
            }
            return user;
        });

        localStorage.setItem('users', JSON.stringify(this.users));
    },

    deleteUser(id) {
        this.users = this.users.filter((user) => user.id !== id);
        localStorage.setItem('users', JSON.stringify(this.users));
    }
};

async function hashPassword(password) {
    const encoded = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}
