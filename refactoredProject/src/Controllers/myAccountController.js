const utils = require('../utils/utils');
const clientModel = require('../Models/clientModel');
const companyModel = require('../Models/companyModel');
const phaseModel = require('../Models/phaseModel');
const imageModel = require('../Models/imageModel');
const fs = require('fs');


async function getUserData(req, res) {
    const user = utils.isAuthenticated(req);
    if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const userData = await clientModel.getClientData(user.username);
        if (!userData) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userData));
    } catch (error) {
        console.error('Error in myAccountController.getUserData:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function addMotto(req, res) {
    const user = utils.isAuthenticated(req);
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
            console.error('Error in myAccountController.addMotto:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
}

async function addLicitation(req, res) {
    const user = utils.isAuthenticated(req);
    if (!user || user.role !== 'client') {
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
        const postData = Object.fromEntries(formData.entries());

        try {
            const post = await phaseModel.addLicitation(postData, user.id); // Ensure user.id is passed as clientId
            res.writeHead(302, { 'Location': '/myacc' });
            res.end();
        } catch (error) {
            console.error('Error in myAccountController.addLicitation:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });

}

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function updateProfilePicture(req, res) {
    const user = utils.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const fileData = fs.readFileSync(req.file.path);
        await imageModel.updateOrInsertProfilePicture(user.id, fileData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Profile picture updated successfully' }));
    } catch (error) {
        console.error('Error in myAccountController.updateProfilePicture:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
    finally {
        fs.unlinkSync(req.file.path); // Remove the file from the temp directory after processing
    }
}

async function getCompany(req, res) {
    const user = utils.isAuthenticated(req);
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
        console.error('Error in myAccountController.getCompany:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }

}


module.exports = { getUserData, getCompany, updateProfilePicture, addLicitation, addMotto };