// Dependencies
const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    unique: true,
    required: true,
  },
  // for twilio call
  priority: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  sub_tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subTask'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// create model
const User = mongoose.model('User', userSchema);

// export model
module.exports = User;
