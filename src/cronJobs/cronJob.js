// Dependencies
const Task = require('../models/task');
const cron = require('node-cron');
const fs = require('fs');
const User = require('../models/user');

// Module scaffolding

// Cron jobs related to tasks
const taskCronJob = () => {
  const logFile = 'task_priority.log';
  cron.schedule('*/20 * * * * *', async () => {
    try {
      const currentDate = new Date();

      // Update tasks with due date today to Priority 0
      await Task.updateMany({ due_date: { $eq: currentDate } }, { $set: { priority: 0 } });

      // Update tasks with due date between tomorrow and day after tomorrow to Priority 1
      const nextTwoDays = new Date(currentDate);
      nextTwoDays.setDate(currentDate.getDate() + 2);
      await Task.updateMany(
        { due_date: { $gt: currentDate, $lte: nextTwoDays } },
        { $set: { priority: 1 } }
      );

      // Update tasks with due date in 3-4 days to Priority 2
      const nextFourDays = new Date(currentDate);
      nextFourDays.setDate(currentDate.getDate() + 4);
      await Task.updateMany(
        { due_date: { $gt: nextTwoDays, $lte: nextFourDays } },
        { $set: { priority: 2 } }
      );

      // Update tasks with due date in 5 or more days to Priority 3
      await Task.updateMany({ due_date: { $gt: nextFourDays } }, { $set: { priority: 3 } });

      const logMessage = `Task priorities updated at ${currentDate}\n`;
      fs.appendFileSync(logFile, logMessage);
      console.log(logMessage);
    } catch (error) {
      const errorMessage = `Error updating task priorities: ${error}\n`;
      fs.appendFileSync(logFile, errorMessage);
      console.error(errorMessage);
    }
  });
}

// Cron jobs related to voice calling
const voiceCallingCronJob = () => {
  const logFile = 'voice_calling.log';
  cron.schedule('*/20 * * * * *', async () => {
    try {
      const users = await User.find().sort({ priority: 1 }); // Sorted by priority
      for (const user of users) {
        const logMessage = `Voice call to be made to user ${user.name} with priority ${user.priority}\n`;
        fs.appendFileSync(logFile, logMessage);
        console.log(logMessage);
      }
    } catch (error) {
      const errorMessage = `Error updating voice calling priorities: ${error}\n`;
      fs.appendFileSync(logFile, errorMessage);
      console.error(errorMessage);
    }
  });
}

// Export module

module.exports = { taskCronJob, voiceCallingCronJob }