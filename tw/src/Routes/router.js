const path = require('path');
const fs = require('fs');
const url = require('url');
const userController = require('../Controllers/userController');
const myAccountController = require('../Controllers/myAccountController');
const postController = require('../Controllers/postController');
const companiesController = require('../Controllers/companiesController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

function handleRequest(req, res) {
    if (req.method === 'GET') {
        let filePath = '';
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        switch (true) {
            case pathname === '/':
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'ind.html');
                break;
            case pathname === '/signup':
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'signup.html');
                break;
            case pathname === '/login':
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'login.html');
                break;
            case pathname === '/afterlog':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'afterlog.html');
                break;
            case pathname === '/myacc':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'myacc.html');
                break;
            case pathname === '/post':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'post.html');
                break;
            case pathname === '/about':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'about.html');
                break;
            case pathname === '/companies':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                } else if (!userController.isUserType(req, 'client')) {
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<script>window.location.href = "/afterlog";</script>');
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'companies.html');
                break;
            case pathname === '/licitations':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                } else if (!userController.isUserType(req, 'company')) {
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<script>window.location.href = "/afterlog";</script>');
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'licitations.html');
                break;
            case pathname.startsWith('/licitationForm'):
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                } else if (!userController.isUserType(req, 'company')) {
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<script>window.location.href = "/afterlog";</script>');
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'licitationForm.html');
                break;
            case pathname === '/houses':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'houses.html');
                break;
            case pathname === '/instalatii':
                if (!userController.isAuthenticated(req)) {
                    res.writeHead(302, { 'Location': '/login' });
                    res.end();
                    return;
                }
                filePath = path.join(__dirname, '..', '..', 'public', 'Contents', 'instalatii.html');
                break;
            case pathname === '/api/user-data':
                myAccountController.getUserData(req, res);
                return;
            case pathname === '/api/role':
                const role = userController.getUserType(req, res);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ role }));
                return;
            case pathname === '/api/companies':
                companiesController.getCompanies(req, res);
                return;
            case pathname === '/api/company':
                companiesController.getCompany(req, res);
                return;
            case pathname === '/api/licitations':
                companiesController.getAvailableLicitations(req, res);
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
            case '/api/addlicitation':
                postController.addLicitation(req, res);
                break;
            case '/api/addoffer':
                companiesController.addOffer(req, res);
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
        }
    } else if (req.method === 'PUT') {
        switch (req.url) {
            case '/api/company/motto':
                companiesController.addMotto(req, res);
                break;
            case '/api/company/profile-picture':
                upload.single('profilePicture')(req, res, function (err) {
                    if (err) {
                        console.error('Error in file upload:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }
                    companiesController.updateProfilePicture(req, res);
                });
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
