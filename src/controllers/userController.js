const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let refreshTokens = []

const userController = {
    // REGISTER
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: hashed,
            });

            const user = await newUser.save();
            res.status(200).json(user);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin, 
        }, process.env.JWT_ACCESS_KEY, { expiresIn: '2d' });
    },
    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        }, process.env.JWT_REFRESH_KEY, { expiresIn: '365d' });
    },
    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Wrong username");
            }
            const validPassword = bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                res.status(404).json("Wrong password");
            }
            if (user && validPassword) {
                const accessToken = userController.generateAccessToken(user);
                const refreshToken = userController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);

                // lưu refresh token vào cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken }); 
            }
        } catch(err) {
            res.status(500).json(err);
        }
    },
    // REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You're not authenticated");
        }
        if (!refreshTokens.includes(refreshToken)) {
            res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            } 
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // tạo mới access token, refresh token
            const newAccessToken = userController.generateAccessToken(user);
            const newRefreshToken = userController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },
    logOut: async (req, res) => {
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json("Log out successfully");
    }
}

module.exports = userController;