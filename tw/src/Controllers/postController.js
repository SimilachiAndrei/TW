const userController = require('../Controllers/userController');
const userModel = require('../Models/userModel');

async function addPost(req, res) {
    const user = userController.isAuthenticated(req);
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
            const post = await userModel.addPost(postData, user.id); // Ensure user.id is passed as clientId
            res.writeHead(302, { 'Location': '/myacc' });
            res.end()
        } catch (error) {
            console.error('Error in userController.addPost:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
}

async function addLicitation(req, res) {
    const user = userController.isAuthenticated(req);
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
            const post = await userModel.addLicitation(postData, user.id); // Ensure user.id is passed as clientId
            res.writeHead(302, { 'Location': '/myacc' });
            res.end();
        } catch (error) {
            console.error('Error in userController.addLicitation:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });

}

module.exports = { addPost, addLicitation };