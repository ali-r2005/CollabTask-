const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const taskSchema = new mongoose.Schema({
    _id: { type: Number },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ['to-do', 'in-progress', 'done'],
        default: 'to-do',
    },
    assignedTo: { type: { _id: String, name: String }, required: true },
    projectId: { type: Number, required: true },
    comments: [{
        text: { type: String, required: true },
        user: { _id: String, name: String },
        timestamp: { type: Date, default: Date.now },
    }],
    attachments: [{ filename: String, path: String }],
}, { timestamps: true });

// taskSchema.index({ status: 1, projectId: 1 });
taskSchema.plugin(AutoIncrement, { inc_field: '_id' });

module.exports = mongoose.model('Task', taskSchema);