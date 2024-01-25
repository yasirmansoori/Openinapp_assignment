// Dependencies
const JWT = require("jsonwebtoken");
require('dotenv').config('../../.env');
const createError = require('http-errors');
const User = require("../models/user");

// Module scaffolding
const authorizationMiddleware = async (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            throw createError.Unauthorized();
        }

        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                throw createError.Unauthorized(message);
            }
            req.payload = payload;
        });

        const user_id = req.payload.aud;
        const user = await User.findById(user_id);

        if (!user) {
            throw createError.NotFound("Not a valid user");
        }

        if (user.role === 'user') {
            throw createError.Unauthorized("You are not authorized to perform this action");
        }

        next();
    } catch (error) {
        next(error);
    }
};

// Export module
module.exports = authorizationMiddleware;
