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

async function getProjects(req, res) {
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const projects = await companyModel.getProjects(user.id);
        console.log(projects);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(projects));
    } catch (error) {
        console.error('Error in companiesController.getProjects:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }

}

async function getFinishedProjects(req, res) {
    const user = userController.isAuthenticated(req);
    console.log(user); // Log user details
    if (!user || user.role == 'company') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const projects = await companyModel.getFinishedProjects(user.id);
        // console.log(projects); // Log the projects retrieved
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(projects));
    } catch (error) {
        console.error('Error in companiesController.getFinishedProjects:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function getReviews(req, res) {
    const user = userController.isAuthenticated(req);
    console.log(user); // Log user details
    if (!user || user.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const reviews = await companyModel.getReviews();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reviews));
    } catch (error) {
        console.error('Error in companiesController.reviews:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}


async function submitReview(req, res) {
    // Check if the user is authenticated and is a company
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'client') {
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

                const result = await companyModel.submitReview(data, user.id);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Review added successfully' }));
            } catch (error) {
                console.error('Error adding offer:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } catch (error) {
        console.error('Error in submitReview controller:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}


async function deleteReview(req, res, reviewId) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const result = await companyModel.deleteReview(reviewId);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Review deleted successfully' }));
            } catch (error) {
                console.error('Error adding offer:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } catch (error) {
        console.error('Error in deleteReview controller:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}



async function getCompanyDetails(req, res) {
    try {
        const fullPath = req.url;

        // Split the path by '/' and get the last part
        const pathParts = fullPath.split('/');
        const companyName = pathParts[pathParts.length - 1];

        const company = await companyModel.getCompanyDetails(companyName);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(company));
    } catch (error) {
        console.error('Error in getCompanyDetails:', error);
    }
}

async function getCompanyPhases(req, res) {
    try {
        const fullPath = req.url;

        // Split the path by '/' and get the last part
        const pathParts = fullPath.split('/');
        const companyName = pathParts[pathParts.length - 1];
        const phases = await companyModel.getCompanyPhases(companyName);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(phases));
    } catch (error) {
        console.error('Error in getCompanyPhases:', error);
    }
}


async function getCompanyReviews(req, res) {
    try {
        const fullPath = req.url;

        // Split the path by '/' and get the last part
        const pathParts = fullPath.split('/');
        const companyName = pathParts[pathParts.length - 1];
        console.log(companyName);
        const reviews = await companyModel.getCompanyReviews(companyName);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reviews));
    } catch (error) {
        console.error('Error in getCompanyReviews:', error);
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
    finally {
        fs.unlinkSync(req.file.path); // Remove the file from the temp directory after processing
    }
}

async function addPhasePicture(req, res) {
    const user = userController.isAuthenticated(req);
    if (!user || user.role !== 'company') {
        if (typeof res.status === 'function') {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
        }
        return;
    }

    const { phaseId } = req.body;

    try {
        const fileData = fs.readFileSync(req.file.path);
        await companyModel.addPhasePicture(phaseId, req.file.filename, fileData);
        if (typeof res.status === 'function') {
            res.status(200).json({ message: 'Phase picture updated successfully' });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Phase picture updated successfully' }));
        }
    } catch (error) {
        console.error('Error in companiesController.addPhasePicture:', error);
        if (typeof res.status === 'function') {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    } finally {
        fs.unlinkSync(req.file.path); // Remove the file from the temp directory after processing
    }
}



module.exports = {
    getCompanies, addMotto, getCompany, updateProfilePicture, getAvailableLicitations,
    addOffer, getProjects, addPhasePicture, getFinishedProjects, submitReview,
    getReviews, deleteReview, getCompanyDetails, getCompanyReviews, getCompanyPhases
};