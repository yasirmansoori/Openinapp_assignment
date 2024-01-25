// Dependencies
const express = require('express');

// Controller
const userController = require("../controllers/userController");

// Module scaffolding
const userRouter = express.Router();

// Create a user
userRouter.post("/register", userController.createUser);

// Export module
module.exports = userRouter;
