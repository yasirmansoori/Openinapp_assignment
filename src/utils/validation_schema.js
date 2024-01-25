const Joi = require('joi');

// user validation schema
const userValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
  priority: Joi.number().integer().min(0).max(2),
  role: Joi.string().valid('user', 'admin')
})
// task validation schema
const taskValidation = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(100).required(),
  due_date: Joi.date().iso().required(),
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE'),
  priority: Joi.number().integer().min(0).max(2),
  assigned_to: Joi.string()
})
// subtask validation schema
const subTaskValidation = Joi.object({
  task_id: Joi.string().required(),
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(100).required(),
  status: Joi.number().integer().min(0).max(1)
})

module.exports = { userValidation, taskValidation, subTaskValidation }