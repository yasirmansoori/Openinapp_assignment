// Dependencies
const { userValidation } = require('../utils/validation_schema');
const { signAccessToken } = require('../config/tokenGenerator')
const createError = require('http-errors');
const User = require('../models/user');
require('dotenv').config('../../.env');

// Module scaffolding
const userController = {};

// Create a new user
userController.createUser = async (req, res, next) => {
  try {
    // Check if phone number already exists
    const result = await userValidation.validateAsync(req.body);
    await User.findOne({ phone_number: result.phone_number }).then((user) => {
      if (user) throw createError.Conflict("This phone number is already acssociated with and account, try registering with a different phone number");
    })
    // Create a new user
    const user = new User(result);
    const savedUser = await user.save();
    // Generate tokens
    const accessToken = await signAccessToken(savedUser.id);
    // Send Response
    const payload = {
      user: savedUser,
      accessToken
    }
    res.status(201).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

// Export module
module.exports = userController;

