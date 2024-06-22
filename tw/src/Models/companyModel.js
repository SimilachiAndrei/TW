// const { getProjects } = require('../Controllers/companiesController');
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

async function submitReview(data, id) {
    try {
        const response = await databaseManager.submitReview(data, id);
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

async function getProjects(id) {
    try {
        const response = await databaseManager.getProjects(id);
        return response;
    } catch (error) {
        console.error('Error in companyModel.getProjects:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function getFinishedProjects(id) {
    try {
        const response = await databaseManager.getFinishedProjects(id);
        return response;
    } catch (error) {
        console.error('Error in companyModel.getFinishedProjects:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function getReviews() {
    try {
        const response = await databaseManager.getReviews();
        return response;
    } catch (error) {
        console.error('Error in companyModel.getReviews:', error);
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

async function addPhasePicture
    (phaseId, fileName, imageData) {
        try {
            const response = await databaseManager.addPhasePicture(phaseId, fileName, imageData);
            return response;
        } catch (error) {
            console.error('Error in companyModel.addMotto:', error);
            throw error; // Re-throw to handle in your controller
        }
}

async function deleteReview(data) {
    try {
        const response = await databaseManager.deleteReview(data);
        return response;
    } catch (error) {
        console.error('Error in companyModel.deleteReview:', error);
        throw error; // Re-throw to handle in your controller
    }
}

async function getCompanyDetails(companyName) {
    try {
        const company = await databaseManager.getCompanyDetails(companyName);
        return company;
    } catch (error) {
        throw error;
    }
}

async function getCompanyPhases(companyName) {
    try {
        const phases = await databaseManager.getCompanyPhases(companyName);
        return phases;
    } catch (error) {
        throw error;
    }
}


async function getCompanyReviews(companyName) {
    try {
        const reviews = await databaseManager.getCompanyReviews(companyName);
        return reviews;
    } catch (error) {
        throw error;
    }
}


module.exports = { getCompanies, addMotto, getCompany, updateOrInsertProfilePicture, 
    getAvailableLicitations, addOffer, getProjects, addPhasePicture,
    getFinishedProjects, submitReview, getReviews, deleteReview,
    getCompanyDetails, getCompanyPhases, getCompanyReviews };
