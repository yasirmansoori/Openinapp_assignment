
// Dependencies
const { taskValidation } = require('../utils/validation_schema');
const createError = require('http-errors');
const User = require('../models/user');
const Task = require('../models/task');
const subTask = require('../models/subTask');
require('dotenv').config('../../.env');

// Module scaffolding
const taskController = {};

// Create a new task and assign it to the required user, can only done by authorized user (admin)
taskController.createTask = async (req, res, next) => {
  try {
    const result = await taskValidation.validateAsync(req.body);
    // if task already exists
    await Task.findOne({ title: result.title }).then((task) => {
      if (task) throw createError.Conflict("This task already exists with status: " + task.status);
    })

    // Create a new task
    const task = new Task(result);
    const savedTask = await task.save();

    // Assign the task to the user, if userId is provided
    if (result.assigned_to) {
      // Check if user exists
      await User.findOne({ _id: result.assigned_to }).then((user) => {
        if (!user) throw createError.NotFound("User to assign task not found");
      })
      // Assign task to user, add task in user's task array
      await User.updateOne({ _id: result.assigned_to }, { $push: { tasks: savedTask._id } }).then((user) => {
        if (!user) throw createError.NotFound("User to assign task not found");
      })
    }
    // const user = await User.findByIdAndUpdate(result.userId, { $push: { tasks: savedTask._id } }, { new: true });

    // Send Response
    const payload = {
      task: savedTask,
      message: result.assigned_to ? "Task successfully created and assigned to " + result.assigned_to : "Task successfully created but not assigned to any user",
    }
    res.status(201).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// Assign a task if not assigned while creating, to a user can only done by authorized user (admin)
taskController.assignTask = async (req, res, next) => {
  try {
    // Get task id and user id
    const taskId = req.params.taskId;
    const userId = req.body.userId;

    // Check if task exists
    await Task.findOne({ _id: taskId }).then((task) => {
      if (!task) throw createError.NotFound("Task not found");
    })

    // Check if user exists
    await User.findOne({ _id: userId }).then((user) => {
      if (!user) throw createError.NotFound("User not found");
    })

    // Check if task is already assigned to user
    await Task.findOne({ _id: taskId, assigned_to: { $ne: null } }).then((task) => {
      if (task) throw createError.Conflict("This task is already assigned to a user");
    })

    // Assign task to user, add task in user's task array 
    await User.updateOne({ _id: userId }, { $push: { tasks: taskId } }).then((user) => {
      if (!user) throw createError.NotFound("User not found");
    })

    // if the task contains sub-tasks, assign them to the same user
    await Task.findOne({ _id: taskId }).then((task) => {
      if (task.sub_tasks.length > 0) {
        // Assign sub-tasks to user, add sub-tasks in user's sub-tasks array
        User.updateOne({ _id: userId }, { $push: { sub_tasks: { $each: task.sub_tasks } } }).then((user) => {
          if (!user) throw createError.NotFound("User not found");
        })
      }
    })

    // Assign user to task, add userId in task's assigned_to field
    await Task.updateOne({ _id: taskId }, { assigned_to: userId }).then((task) => {
      if (!task) throw createError.NotFound("Task not found");
    })

    // Send Response
    const payload = {
      message: "Task assigned to user successfully"
    }
    res.status(200).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// Get all user tasks
taskController.getAllUserTasks = async (req, res, next) => {
  try {
    // Get user id
    const userId = req.body.userId;
    // Check if user exists
    await User.findOne({ _id: userId }).then((user) => {
      if (!user) throw createError.NotFound("User not found");
    })
    // Get filters from query parameters
    const { priority, status, page, pageSize } = req.query;
    // Build Query
    const taskQuery = {
      assigned_to: userId,
      ...(priority && { priority }),
      ...(status && { status })
    }
    // pagination
    const skip = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Get all tasks assigned to the user
    const tasks = await Task.find(taskQuery)
      .limit(limit)
      .skip(skip);

    // Remove unnecessary fields from each task
    const filteredTasks = tasks.map((task) => {
      const { title, description, due_date, status, priority } = task;
      return {
        title,
        description,
        due_date,
        status,
        priority,
      };
    });

    // Send Response
    const payload = {
      tasks: filteredTasks,
      "total tasks": filteredTasks.length
    }
    // Send Response
    res.status(200).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// Update a task
taskController.updateTask = async (req, res, next) => {
  try {
    // Get task id
    const taskId = req.params.taskId;
    // Get status, due_date from body and validate it
    const { status, due_date } = req.body;
    if (!status && !due_date) throw createError.BadRequest("Status/due_date is required");
    if (status && status !== "TODO" && status !== "IN_PROGRESS" && status !== "DONE") throw createError.BadRequest("Invalid status");

    // Check if task exists
    await Task.findOne({ _id: taskId }).then((task) => {
      if (!task) throw createError.NotFound("Task not found");
    })
    // Update task status and due_date
    const updateFields = {};
    if (status) {
      updateFields.status = status;
    }
    if (due_date) {
      updateFields.due_date = due_date;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, { new: true }).select("status due_date");
    // Send Response
    const payload = {
      updatedTask,
      message: "Task updated successfully"
    }
    res.status(200).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// Delete a task
taskController.deleteTask = async (req, res, next) => {
  try {
    // Get task id
    const taskId = req.params.taskId;

    // Check if task exists
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      throw createError.NotFound("Task not found");
    }

    // Delete task from task model
    await Task.findByIdAndDelete(taskId);

    // Delete task and its sub-tasks from user model
    await User.updateMany(
      { tasks: taskId },
      { $pull: { tasks: taskId, sub_tasks: { $in: task.sub_tasks } } }
    );
    // Delete sub-tasks of the task from sub-task model
    await subTask.deleteMany({ task_id: taskId });

    // Send Response
    const payload = {
      message: "Task deleted successfully"
    }
    res.status(200).send(payload);
  } catch (error) {
    next(error);
  }
}

// Export module
module.exports = taskController;

