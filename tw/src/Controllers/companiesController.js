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



module.exports = { getCompanies, addMotto, getCompany, updateProfilePicture };