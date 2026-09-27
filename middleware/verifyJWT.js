const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error('ACCESS_TOKEN_SECRET is not configured.');
        return res.status(500).json({ message: 'Authentication service is unavailable.' });
    }

    const token = authHeader.split(' ')[1];

    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            return next();
        }
    );
};

module.exports = verifyJWT;
