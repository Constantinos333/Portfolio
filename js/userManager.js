// 1. Initialize Global Variables
const userManager = {
    // 1. LOAD: Initialize users from localStorage (if they exist), otherwise use empty array
    users: JSON.parse(localStorage.getItem('users')) || [],

    //CREATE: Accepts the externally-created user object as is
    addUser(user) {
        this.users.push(user);
        // 2. SAVE: Convert the updated array to a string and save it to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
    },

    //READ: Returns a new shallow copy of all users
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

    //UPDATE: Reassigns the array and protects 'id' & 'createdAt'
    updateUser(id, updates) {
        this.users = this.users.map((user) => {
            if (user.id === id) {
                return { ...user, ...updates, id: user.id, createdAt: user.createdAt };
            }
            return user;
        });

        localStorage.setItem('users', JSON.stringify(this.users));
        //returns the updated user object
    },

    //DELETE: Reassigns the array to exclude the specific ID
    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id);
    }

};
