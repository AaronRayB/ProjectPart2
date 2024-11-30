const mongoose = require('mongoose');  // Import mongoose

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema); // Export the model
