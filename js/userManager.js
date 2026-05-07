// 1. Initialize Global Variables
const userManager = {
    // 1. LOAD: Initialize users from localStorage (if they exist), otherwise use empty array
    users: JSON.parse(localStorage.getItem('users')) || [],

    addUser(user) {
        this.users.push(user);
        // 2. SAVE: Convert the updated array to a string and save it to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
    },

    findUserByUsername(username) {
        return this.users.find((user) => user.username === username);
    },

    checkUsername(username) {
        return this.findUserByUsername(username) !== undefined;
    }
};