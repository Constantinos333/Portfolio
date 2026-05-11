// 1. Initialize Global Variables
const userManager = {
    // 1. LOAD: Initialize users from localStorage (if they exist), otherwise use empty array
    users: JSON.parse(localStorage.getItem('users')) || [],

    addUser(user) {
        this.users.push(user);
        // 2. SAVE: Convert the updated array to a string and save it to localStorage
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
                return { ...user, ...updates };
            }
            return user;
        }); //This needs work, as of now it may update UID and TimeStamp which are meant to be immutable

        localStorage.setItem('users', JSON.stringify(this.users));
    }

};