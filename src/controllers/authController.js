const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyRefreshToken } = require('../middleware/jwtVerify');
const client = require('../config/redis');

const authController = {
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
        }, process.env.JWT_ACCESS_KEY, { expiresIn: '30s' });
    },
    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return new Promise((resolve, reject) => {
            const payload = {
                id: user.id,
                admin: user.admin,
            };
            jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '365d' }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    client.set(payload.id.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(token);
                        }
                    });
                }
            });
        });
    },
    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Wrong username");
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                res.status(404).json("Wrong password");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = await authController.generateRefreshToken(user);
                // lưu refresh token vào cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken, refreshToken }); 
            }
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        // take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You are not authenticated")
        } 
        try {
            const payload = await verifyRefreshToken(refreshToken);
            const user = await User.findById(payload.id);
            const accessToken = authController.generateAccessToken(user);
            const newRefreshToken = await authController.generateRefreshToken(user);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            });
            return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        } 
    },
    logOut: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        res.clearCookie('refreshToken');
        const payload = await verifyRefreshToken(refreshToken);
        client.del(payload.id.toString(), (err, reply) => {
            if (err) return err;
            return res.status(200).json({message: 'Log out successfully'});
        })
    }
}

module.exports = authController;