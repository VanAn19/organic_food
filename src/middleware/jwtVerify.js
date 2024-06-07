const jwt = require('jsonwebtoken');
const client = require('../config/redis');

const middlewareController = {
    // VERIFY TOKEN
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyRefreshToken: async (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
                if (err) {
                    return reject(err);
                }
                client.get(payload.id.toString(), (err, reply) => {
                    if (err) reject(err);
                    if (refreshToken === reply) {
                        return resolve(payload);
                    }
                })
            })
        })
    },
    verifyTokenAndAuth: (req,res,next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.admin) {
                next();
            } else {
                return res.status(403).json('You are not allow to access');
            }
        })
    }
}

module.exports = middlewareController;