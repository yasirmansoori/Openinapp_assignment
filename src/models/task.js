// Dependencies
const mongoose = require('mongoose');

// Task schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  priority: { type: Number, default: 0 },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sub_tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subTask' }],
}, { timestamps: true });

// create model
const Task = mongoose.model('Task', taskSchema);

// export model
module.exports = Task;

// No subtasks finished - TODO, atleast 1 subtask completed - IN_PROGRESS, All subtasks completed - DONE