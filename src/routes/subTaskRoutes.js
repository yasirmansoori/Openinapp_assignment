// Dependencies
const express = require('express');

// Controller
const subTaskController = require("../controllers/subTaskController");
const authorizationMiddleware = require('../middlewares/authorization');

// Module scaffolding
const subTaskRouter = express.Router();

// Create a sub-task, only by authorized user (admin)
subTaskRouter.post("/createSubTask", authorizationMiddleware, subTaskController.createSubTask);

// Get all user sub tasks
subTaskRouter.get("/getAllSubTasks", subTaskController.getAllUserSubTasks);

// Update a sub task 
subTaskRouter.patch("/updateSubTask/:subTaskId", subTaskController.updateSubTask);

// Delete a sub task
subTaskRouter.delete("/deleteSubTask/:subTaskId", subTaskController.deleteSubTask);

// Export module
module.exports = subTaskRouter;
