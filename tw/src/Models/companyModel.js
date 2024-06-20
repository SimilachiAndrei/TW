const databaseManager = require('../Database/dbManager'); // Ensure the correct path to your companyModel

async function getCompanies(req, res) {
    try {
        const companiesData = await databaseManager.getCompanies();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(companiesData));
    } catch (error) {
        console.error('Error in getCompanies controller:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function addMotto(data, id) {
    try {
        const response = await databaseManager.addMotto(data, id);
        return response;
    } catch (error) {
        console.error('Error in companyModel.addMotto:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function addOffer(data, id) {
    try {
        const response = await databaseManager.addOffer(data, id);
        return response;
    } catch (error) {
        console.error('Error in companyModel.addOffer:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function getCompany(id) {
    try {
        const response = await databaseManager.getCompany(id);
        return response;
    } catch (error) {
        console.error('Error in companyModel.addMotto:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function getAvailableLicitations() {
    try {
        const response = await databaseManager.getAvailableLicitations();
        return response;
    } catch (error) {
        console.error('Error in companyModel.addMotto:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function updateOrInsertProfilePicture
    (userId, fileName, imageData) {
        try {
            const response = await databaseManager.updateOrInsertProfilePicture(userId, fileName, imageData);
            return response;
        } catch (error) {
            console.error('Error in companyModel.addMotto:', error);
            throw error; // Re-throw to handle in your controller
        }
}




module.exports = { getCompanies, addMotto, getCompany, updateOrInsertProfilePicture, 
    getAvailableLicitations, addOffer };
