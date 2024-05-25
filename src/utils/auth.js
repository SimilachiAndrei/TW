const jwt = require('jsonwebtoken');
const secretKey = '12345te42456g9buhbyutrdryeurdcyr67766hren4444425tggrb334556vf'; 

const generateToken = (user) => {
    return jwt.sign({ id: user.id ,username: user.username, role: user.role}, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};


module.exports = { generateToken, verifyToken };