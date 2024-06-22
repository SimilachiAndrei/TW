const url = require('url');
const utils = require('../utils/utils');
const adminController = require('../Controllers/adminController');


function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    if (pathname.startsWith('/api/deleteReview')) {
        if (!utils.isAuthenticated(req)) {
            res.writeHead(302, { 'Location': '/login' });
            res.end();
            return;
        } else if (!utils.isUserType(req, 'admin')) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        // Extract the review ID from the URL
        const reviewId = pathname.split('/').pop();
        adminController.deleteReview(req, res, reviewId);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

module.exports = { handleRequest };