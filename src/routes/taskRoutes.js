// Dependencies
const express = require('express');

// Controller
const taskController = require("../controllers/taskController");
const authorizationMiddleware = require('../middlewares/authorization');

// Module scaffolding
const taskRouter = express.Router();

// Create a task, can only done by authorized user (admin) 
taskRouter.post("/createTask", authorizationMiddleware, taskController.createTask);

// Assign a task to a user, can only done by authorized user (admin)
taskRouter.post("/assignTask/:taskId", authorizationMiddleware, taskController.assignTask);

// Get all user tasks provided user id
taskRouter.get("/getAllTasks", taskController.getAllUserTasks);

// Update a task 
taskRouter.patch("/updateTask/:taskId", taskController.updateTask);

// Delete a task
taskRouter.delete("/deleteTask/:taskId", taskController.deleteTask);

// Export module
module.exports = taskRouter;
