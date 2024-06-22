// src/Models/userModel.js
const databaseManager = require('../Database/dbManager');

async function addUser(userData) {
    try {
        const user = await databaseManager.addUser(userData);
        return user;
    } catch (error) {
        console.error('Error in userModel.addUser:', error);
        throw error;
    }
}


async function getUser(username) {
    try {
        const user = await databaseManager.getUserByUsername(username);
        return user;
    } catch (error) {
        console.error('Error in userModel.getUser:', error);
        throw error; 
    }
}


module.exports = { addUser, getUser};
