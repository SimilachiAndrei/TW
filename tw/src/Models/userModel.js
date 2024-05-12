// userModel.js

let users = []; // Array to store user data

function addUser(userData) {
    users.push(userData);
}

function getUser(username) {
    return users.find(user => user.username === username);
}

module.exports = { addUser, getUser };
