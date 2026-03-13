
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

async function authMiddleware(req, res, next) {
    try {
        let token = null;
        
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = req.cookies.token;
        }
        
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }
        
        const blacklistedToken = await blacklistModel.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error in authMiddleware:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;
// const jwt = require('jsonwebtoken');
// const blacklistModel = require('../models/blacklist.model');

// async function authMiddleware(req, res, next) {
//     try {

//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({ message: 'Token not provided' });
//         }
//         const blacklistedToken = await blacklistModel.findOne({ token });
//         console.log('Blacklisted token:', blacklistedToken);

//         if (blacklistedToken) { 
//             return res.status(401).json({ message: 'Token is blacklisted' });
//         }   
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded token:', decoded);
//         req.user = decoded;
//         next();
//     }
//     catch (err) {
//         console.error('Error in authMiddleware:', err);
//         res.status(401).json({ message: 'Invalid token' });
//     }   
// }
// module.exports = authMiddleware;