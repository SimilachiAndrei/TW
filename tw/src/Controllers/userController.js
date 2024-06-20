const { parse } = require('cookie');
const auth = require('../utils/auth');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');

async function signup(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const formData = new URLSearchParams(body);
        const username = formData.get('username');
        const password = formData.get('password');
        const userType = formData.get('type');
        const email = formData.get('email');

        if (!username || !password || !userType || !email) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing required fields');
            return;
        }

        const userExists = await userModel.getUser(username);
        if (userExists) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Username already exists');
            return;
        }

        const userData = {
            username,
            email,
            password,
            role: userType // Assuming userType is 'admin', 'client', or 'company'
        };

        if (userType === 'company') {
            const companyName = formData.get('companyName');
            const companyAddress = formData.get('companyAddress');
            const companyPhone = formData.get('companyPhone');
            const companyProfile = formData.get('companyProfile');

            if (!companyName || !companyAddress || !companyPhone || !companyProfile) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Missing required company fields');
                return;
            }

            userData.companyName = companyName;
            userData.companyAddress = companyAddress;
            userData.companyPhone = companyPhone;
            userData.companyProfile = companyProfile;
        }

        await userModel.addUser(userData);
        res.writeHead(302, { 'Location': '/login' });
        res.end();
    });
}

async function login(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = new URLSearchParams(body);
        const username = formData.get('username');
        const password = formData.get('password');

        const user = await userModel.getUser(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(`
            <script>alert('Invalid credentials!');</script>
            <script>window.location.href = "/login";</script>
          `);
            return;
        }
        const token = auth.generateToken(user);

        res.writeHead(302, {
            'Location': '/afterlog',
            'Set-Cookie': `token=${token}; HttpOnly; SameSite=Strict`
        });
        res.end();
    });
}

function isAuthenticated(req) {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    const user = auth.verifyToken(token);
    return user ? user : null;
}

function isUserType(req, type) {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    const user = auth.verifyToken(token);
    if (user.role === type) return true;
    return false;
}

function getUserType(req, type) {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    const user = auth.verifyToken(token);
    return user.role;
}

function logout(req, res) {
    res.writeHead(302, {
        'Location': '/login',
        'Set-Cookie': 'token=; HttpOnly; SameSite=Strict; Max-Age=0'
    });
    res.end();
}


async function getUserData(req, res) {
    const user = isAuthenticated(req);
    if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const userData = await userModel.getAllUserData(user.username);
        if (!userData) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userData));
    } catch (error) {
        console.error('Error in userController.getUserData:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function getOffers(req, res) {
    const user = isAuthenticated(req);
    if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const offers = await userModel.getOffers(user.id);
        if (!offers.length) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify('No offers found'));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(offers));
    } catch (error) {
        console.error('Error in userController.getOffers:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function acceptOffer(req, res) {
    const user = isAuthenticated(req);
    if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        try {
            body = Buffer.concat(body).toString();
            const { offerId } = JSON.parse(body);

            // Now you have access to offerId
            console.log(offerId);

            // Handle your business logic here, e.g., userModel.acceptOffer(offerId)
            userModel.acceptOffer(offerId);
            // Send response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Offer accepted successfully' }));
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}



module.exports = {
    signup, login, isAuthenticated, logout, isUserType, getUserData, getUserType,
    getOffers, acceptOffer
};

