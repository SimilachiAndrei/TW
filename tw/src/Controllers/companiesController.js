const companyModel = require('../Models/companyModel');
const userController = require('../Controllers/userController');
const fs = require('fs');


async function getCompanies(req, res) {
    try {
        await companyModel.getCompanies(req, res);
    } catch (error) {
        console.error('Error in myAccountController:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function addMotto(req, res) {
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = new URLSearchParams(body);
        const data = Object.fromEntries(formData.entries());

        try {
            const motto = await companyModel.addMotto(data, user.id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Motto added successfully' }));
        } catch (error) {
            console.error('Error in companiesController.addMotto:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
}

async function addOffer(req, res) {
    // Check if the user is authenticated and is a company
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const formData = new URLSearchParams(body);
                const data = Object.fromEntries(formData.entries());

                const result = await companyModel.addOffer(data, user.id);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Offer added successfully', offerId: result.offerId }));
            } catch (error) {
                console.error('Error adding offer:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } catch (error) {
        console.error('Error in addOffer controller:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}


async function getCompany(req, res) {
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const company = await companyModel.getCompany(user.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(company));
    } catch (error) {
        console.error('Error in companiesController.getCompany:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }

}

async function getAvailableLicitations(req, res) {
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const licitations = await companyModel.getAvailableLicitations();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(licitations));
    } catch (error) {
        console.error('Error in companiesController.getCompany:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }

}


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function updateProfilePicture(req, res) {
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const fileData = fs.readFileSync(req.file.path);
        await companyModel.updateOrInsertProfilePicture(user.id, fileData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Profile picture updated successfully' }));
    } catch (error) {
        console.error('Error in companiesController.updateProfilePicture:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}



module.exports = { getCompanies, addMotto, getCompany, updateProfilePicture, getAvailableLicitations,
    addOffer
 };