/**
 * Title: Openinapp assignment
 * Author: Yasir Mansoori
 */

// Dependencies
const express = require('express');
const db = require("./src/db/db");
const userRouter = require('./src/routes/userRoutes');
const taskRouter = require('./src/routes/taskRoutes');
const subTaskRouter = require('./src/routes/subTaskRoutes');
const { notFoundMiddleware, defaultErrorHandler } = require('./src/middlewares/error');
const { taskCronJob, voiceCallingCronJob } = require('./src/cronJobs/cronJob');

// Environment variables
const PORT = process.env.PORT || 3001;
const CONNECTION_STRING = `${process.env.CONNECTION_URI}/${process.env.DATABASE_NAME}`;

// Connect the database
db.connect(CONNECTION_STRING)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log(err.message);
  });

// configure
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
app.use("/api/user/", userRouter);

// Task routes
app.use("/api/task/", taskRouter);

// SubTask routes
app.use("/api/subTask/", subTaskRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Openinapp assignment");
})

// 404 Not Found middleware
app.use(notFoundMiddleware);

// Error Handling Middleware
app.use(defaultErrorHandler);

// Start cron jobs
taskCronJob();
voiceCallingCronJob();

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});