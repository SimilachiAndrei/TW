const userController = require('./userController');

async function getUserData(req, res) {
    try {
        await userController.getUserData(req, res);
    } catch (error) {
        console.error('Error in myAccountController:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

module.exports = { getUserData };