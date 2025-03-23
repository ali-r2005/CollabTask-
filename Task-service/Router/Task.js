const express = require('express');
const router = express.Router();
const axios = require('axios');
const http = require("http");
const { Server } = require("socket.io");
const Task = require('../Model/TaskModel');
const { authenticateToken } = require('../Middleware/Auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

const sendNotification = (message,projectId) => {
  io.to(projectId).emit("notification", message);
};

router.get('/reminders', authenticateToken, async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = await Task.find({ deadline: { $lte: tomorrow }, status: { $ne: 'done' } });
    if (tasks.length === 0) {
      return res.json({ message: 'No tasks due soon' });
    }
    const reminders = tasks.map(task => ({
      id: task._id,
      title: task.title,
      deadline: task.deadline,
      status: task.status,
    }));
    res.json({ reminders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, status } = req.query;
    const query = { projectId: projectId || { $exists: true } };
    if (status) query.status = status;

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {

    const response = await axios.get(`http://localhost:3001/auth/user/${req.user.id}`, {
        headers: { 
            'Authorization': req.header('Authorization')
        }
    })

    const assignedUser = response.data;

    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 'medium',
      deadline: req.body.deadline,
      status: req.body.status || 'to-do',
      assignedTo: { _id: assignedUser._id, name: assignedUser.name },
      projectId: req.body.projectId,
    });
    await task.save();
    sendNotification('New task created', req.body.projectId);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.assignedTo.id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true }
        );
        sendNotification('Task updated', updatedTask.projectId);
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    });

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.assignedTo.id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        sendNotification('Task deleted', task.projectId);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.comments.push({ text: req.body.text, user: { id: req.user.id, username: req.user.username } });
    await task.save();
    sendNotification('New comment added', task.projectId);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/attachments', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
  
    if (!task) { 
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.attachments.push({ filename: req.file.originalname, path: req.file.path });
    await task.save();
    sendNotification('New attachment added', task.projectId);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;