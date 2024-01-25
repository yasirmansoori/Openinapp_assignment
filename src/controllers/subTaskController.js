// Dependencies
const { subTaskValidation } = require('../utils/validation_schema');
const createError = require('http-errors');
const User = require('../models/user');
const Task = require('../models/task');
const subTask = require('../models/subTask');
require('dotenv').config('../../.env');

// Module scaffolding
const subTaskController = {};

// Create a new sub-task of the task with task_id given, assign it to the required user, can only done by authorized user (admin)
subTaskController.createSubTask = async (req, res, next) => {
  try {
    const result = await subTaskValidation.validateAsync(req.body);
    // if sub-task already exists
    await subTask.findOne({ title: result.title }).then((subTask) => {
      if (subTask) throw createError.Conflict("This sub-task already exists with status: " + subTask.status);
    })
    // Create a new sub-task of the task with task_id given
    const sub_task = new subTask(result);
    const savedSubTask = await sub_task.save();

    // Check if task exists with task_id given
    await Task.findOne({ _id: result.task_id }).then((task) => {
      if (!task) throw createError.NotFound("Task not found");
    })
    // Assign sub-task to task, add sub-task in task's sub-task array
    await Task.updateOne({ _id: result.task_id }, { $push: { sub_tasks: savedSubTask._id } }).then((task) => {
      if (!task) throw createError.NotFound("Task not found");
    })
    // if task is assigned to a user, assign sub-task to the same user
    await Task.findOne({ _id: result.task_id }).then((task) => {
      if (task.assigned_to) {
        // Assign sub-task to user, add sub-task in user's sub-task array
        User.updateOne({ _id: task.assigned_to }, { $push: { sub_tasks: savedSubTask._id } }).then((user) => {
          if (!user) throw createError.NotFound("User not found");
        })
      }
    })
    // Send Response
    const payload = {
      sub_task: savedSubTask,
      message: "Sub Task successfully created"
    }
    res.status(201).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// Get all user sub tasks
subTaskController.getAllUserSubTasks = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    // Check if user exists
    const user = await User.findOne({ _id: userId });
    if (!user) throw createError.NotFound("User not found");

    const payload = {};

    if (req.query.taskId) {
      // Check if task exists
      const task = await Task.findOne({ _id: req.query.taskId });
      if (!task) throw createError.NotFound("Task not found");

      // Fetch sub-tasks of the specified task
      const subTasksByTaskId = await subTask.find({ task_id: req.query.taskId });
      payload.subTasks = subTasksByTaskId.map(subTask => ({
        title: subTask.title,
        description: subTask.description,
        status: subTask.status,
      }));
    } else {
      // Fetch all sub-tasks from the user model
      const userAllSubTasks = await User.findOne({ _id: userId }).populate('sub_tasks');
      payload.subTasks = userAllSubTasks.sub_tasks.map(subTask => ({
        title: subTask.title,
        description: subTask.description,
        status: subTask.status,
      }));
    }
    payload.totalSubTasks = payload.subTasks.length;
    // Send Response
    res.status(200).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

// Update a sub-task
subTaskController.updateSubTask = async (req, res, next) => {
  try {
    // Get sub-task id
    const subTaskId = req.params.subTaskId;
    // Get status from body and validate it
    const { status } = req.body;
    if (!status) throw createError.BadRequest("Status is required");
    if (status !== "0" && status !== "1") throw createError.BadRequest("Invalid status");

    // Check if sub-task exists
    await subTask.findOne({ _id: subTaskId }).then((subTask) => {
      if (!subTask) throw createError.NotFound("Sub-task not found");
    })

    const updatedSubTask = await subTask.findByIdAndUpdate(subTaskId, req.body, { new: true }).select("status");
    // Send Response
    const payload = {
      updatedSubTask,
      message: "Sub-task updated successfully"
    }
    res.status(200).send(payload);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// Delete a sub-task
subTaskController.deleteSubTask = async (req, res, next) => {
  try {
    // Get sub-task id
    const subTaskId = req.params.subTaskId;

    // Check if sub-task exists
    const SubTask = await subTask.findOne({ _id: subTaskId });
    if (!SubTask) {
      throw createError.NotFound("Sub-task not found");
    }

    // Delete sub-task from sub-task model
    await subTask.findByIdAndDelete(subTaskId);

    // Delete sub-task from user model
    await User.updateMany(
      { sub_tasks: subTaskId },
      { $pull: { sub_tasks: subTaskId } }
    );

    // Delete sub-task from task model
    await Task.updateMany(
      { sub_tasks: subTaskId },
      { $pull: { sub_tasks: subTaskId } }
    );

    // Send Response
    const payload = {
      message: "Sub-task deleted successfully"
    }
    res.status(200).send(payload);
  } catch (error) {
    next(error);
  }
}
// Export module
module.exports = subTaskController;

