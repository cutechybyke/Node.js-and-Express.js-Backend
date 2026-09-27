const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (typeof user !== 'string' || typeof pwd !== 'string' || !user.trim() || !pwd) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        console.error('JWT secrets are not configured.');
        return res.status(500).json({ message: 'Authentication service is unavailable.' });
    }

    try {
        const foundUser = await User.findOne({ username: user.trim() }).exec();
        if (!foundUser) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) {
            return res.sendStatus(401);
        }

        const roles = Object.values(foundUser.roles || {}).filter(Boolean);
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ roles, accessToken });
    } catch (err) {
        console.error('Login failed:', err);
        return res.status(500).json({ message: 'Unable to complete login.' });
    }
};

module.exports = { handleLogin };
