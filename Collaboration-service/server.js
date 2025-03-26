require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connecté")).catch(err => console.error("Erreur MongoDB :", err));

const Message = require('./models/Message');

io.on('connection', (socket) => {
    console.log(`Utilisateur connecté : ${socket.id}`);

    socket.on('joinProject', (projectId) => {
        socket.join(projectId);
        console.log(` Utilisateur ${socket.id} a rejoint le projet ${projectId}`);
    });

    socket.on('sendMessage', async (data) => {
        const { sender, projectId, content } = data;
        if (!socket.rooms.has(projectId)) {
            socket.join(projectId);
            console.log(`User auto-joined project ${projectId}`);
        }
        const message = new Message({ sender, projectId, content });
        await message.save();
        io.to(projectId).emit('receiveMessage', message);       
    });

    socket.on('sendNotification', (data) => {
        const {message, projectId } = data
        if (!socket.rooms.has(projectId)) {
            socket.join(projectId);
            console.log(`User auto-joined project ${projectId}`);
        }
        const newMessage = `Project: ${projectId} -> ${message}`;
        console.log(newMessage);
        io.to(projectId).emit('receiveNotification',  {message, projectId });
    });

    socket.on('disconnect', () => {
        console.log(` Utilisateur déconnecté : ${socket.id}`);
    });
});

app.get('/messages/:projectId', async (req, res) => {
    try {
        const messages = await Message.find({ projectId: req.params.projectId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Serveur de collaboration sur http://localhost:${PORT}`);
});
