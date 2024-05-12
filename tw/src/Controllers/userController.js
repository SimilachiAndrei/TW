// userController.js

const { parse } = require('cookie');

const sessions = {};

function generateSessionId() {
    return Math.random().toString(36).substring(2);
}


const userModel = require('../Models/userModel');

function signup(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
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

        if (userModel.getUser(username)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Username already exists');
            return;
        }

        const userData = {
            username,
            password,
            userType,
            email
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

        userModel.addUser(userData);
        res.writeHead(302, { 'Location': '/login' });
        res.end();
    });
}

function login(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = new URLSearchParams(body);
        const username = formData.get('username');
        const password = formData.get('password');

        const user = userModel.getUser(username);
        if (!user || user.password !== password) {
            res.writeHead(302, { 'Location': '/login' });
            res.end();
            return;
        }

        const sessionId = generateSessionId();
        sessions[sessionId] = { username: user.username, userType: user.userType };

        res.writeHead(302, {
            'Location': '/afterlog',
            'Set-Cookie': `sessionId=${sessionId}; HttpOnly`
        });
        res.end();
    });
}

function isAuthenticated(req) {
    const cookies = parse(req.headers.cookie || '');
    return sessions[cookies.sessionId];
}

function logout(req, res) {
    const cookies = parse(req.headers.cookie || '');
    delete sessions[cookies.sessionId];

    res.writeHead(302, { 'Location': '/login' });
    res.end();
}

module.exports = { signup, login, isAuthenticated, logout };
