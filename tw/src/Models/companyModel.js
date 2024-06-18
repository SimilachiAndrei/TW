const databaseManager = require('../Database/dbManager'); // Ensure the correct path to your companyModel

async function getCompanies(req, res) {
    try {
        const companiesData = await companyModel.getCompanies();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(companiesData));
    } catch (error) {
        console.error('Error in getCompanies controller:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function addMotto(data,id) {
    try {
        const response = await databaseManager.addMotto(data,id);
        return response;
    } catch (error) {
        console.error('Error in companyModel.addMotto:', error);
        throw error; // Re-throw to handle in your controller
    }
}

module.exports = { getCompanies, addMotto };
