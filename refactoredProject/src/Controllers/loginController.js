const auth = require('../utils/auth');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');

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


function logout(req, res) {
    res.writeHead(302, {
        'Location': '/login',
        'Set-Cookie': 'token=; HttpOnly; SameSite=Strict; Max-Age=0'
    });
    res.end();
}

module.exports = { login, logout }