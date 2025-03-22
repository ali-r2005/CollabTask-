const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: String,       
    projectId: String,   
    content: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
