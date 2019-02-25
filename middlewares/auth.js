const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth (req , res , next) {
    // read user req header
    const token = req.header('x-auth-token');
    // if access token not provided
    if (!token) return res.status(401).send('Access Denied. No Token Provided');
    try {
        const payload = jwt.verify(token, config.get('privateKey'));
        req.user = payload;
        next();
    } catch (ex) {
        return res.status(400).send('Invalid Token..');
    }
}