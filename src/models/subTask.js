// Dependencies
const mongoose = require('mongoose');

// subTask schema
const subTaskSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 0 },// 0 - pending, 1 - completed
  deleted_at: { type: Date },
}, { timestamps: true });

// create model
const subTask = mongoose.model('subTask', subTaskSchema);

// export model
module.exports = subTask;
