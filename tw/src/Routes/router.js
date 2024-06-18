const path = require('path');
const fs = require('fs');

const userController = require('../Controllers/userController');
const myAccountController = require('../Controllers/myAccountController');
const postController = require('../Controllers/postController');
const companiesController = require('../Controllers/companiesController');

function handleRequest(req, res) {
    if (req.method === 'GET') {
        let filePath = '';
        switch (req.url) {
            case '/':
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'ind.html');
                break;
            case '/signup':
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'signup.html');
                break;
            case '/login':
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'login.html');
                break;
            case '/afterlog':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'afterlog.html');
                break;
            case '/myacc':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'myacc.html');
                break;
            case '/post':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'post.html');
                break;
            case '/about':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'about.html');
                break;
            case '/companies':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                else if (userController.isUserType(req, "client") === false) {//PROBLEM : TODO
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`
                      <script>window.location.href = "/afterlog";</script>
                    `);
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'companies.html');
                break;
            case '/houses':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'houses.html');
                break;
            case '/instalatii':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'instalatii.html');
                break;
            case '/api/user-data':
                myAccountController.getUserData(req, res);
                return;
            case '/api/role':
                const role = userController.getUserType(req,res);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ role }));
                return;
            case '/api/companies':
                companiesController.getCompanies(req,res);
                return;
            default:
                filePath = path.join(__dirname, '..', '..', 'public', req.url);
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            } else {
                let contentType = 'text/html';
                const extname = path.extname(filePath);
                switch (extname) {
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    } else if (req.method === 'POST') {
        switch (req.url) {
            case '/signup':
                userController.signup(req, res);
                break;
            case '/login':
                userController.login(req, res);
                break;
            case '/post':
                postController.addPost(req, res);
                break;
            case '/api/motto':
                companiesController.addMotto(req,res);
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}

module.exports = handleRequest;
