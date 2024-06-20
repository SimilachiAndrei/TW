// src/Models/userModel.js
// const { acceptOffer } = require('../Controllers/userController');
const databaseManager = require('../Database/dbManager');

async function addUser(userData) {
    try {
        const user = await databaseManager.addUser(userData);
        return user;
    } catch (error) {
        console.error('Error in userModel.addUser:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function addPost(postData, clientId) {
    if (!clientId) {
        throw new Error('Client ID is required to add a post');
    }
    
    try {
        const post = await databaseManager.addPost(postData, clientId);
        return post;
    } catch (error) {
        console.error('Error in userModel.addPost:', error);
        throw error;
    }
}

async function addLicitation(postData, clientId) {
    if (!clientId) {
        throw new Error('Client ID is required to add a post');
    }
    
    try {
        const post = await databaseManager.addLicitation(postData, clientId);
        return post;
    } catch (error) {
        console.error('Error in userModel.addLicitation:', error);
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

async function getOffers(id) {
    try {
        const offers = await databaseManager.getOffers(id);
        return offers;
    } catch (error) {
        console.error('Error in userModel.getUser:', error);
        throw error; 
    }
}


async function getAllUserData(username) {
    try {
        const userData = await databaseManager.getAllUserData(username);
        return userData;
    } catch (error) {
        console.error('Error in userModel.getAllUserData:', error);
        throw error;
    }
}

async function acceptOffer(id) {
    try {
        const offers = await databaseManager.acceptOffer(id);
        return offers;
    } catch (error) {
        console.error('Error in userModel.acceptOffer:', error);
        throw error; 
    }
}

module.exports = { addUser, getUser, getAllUserData, addPost, addLicitation,
    getOffers, acceptOffer
 }; // Ensure getAllUserData is exported
