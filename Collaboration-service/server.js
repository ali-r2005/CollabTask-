require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const amqp = require('amqplib');

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

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("notifications");
        return channel;
    } catch (error) {
        console.error("🔴 Erreur RabbitMQ :", error);
    }
}

let rabbitChannel;
connectRabbitMQ().then(channel => rabbitChannel = channel);

// 🔹 Gérer les connexions WebSocket
io.on('connection', (socket) => {
    console.log(`🔵 Utilisateur connecté : ${socket.id}`);

    // Joindre une salle pour un projet spécifique
    socket.on('joinProject', (projectId) => {
        socket.join(projectId);
        console.log(`👥 Utilisateur ${socket.id} a rejoint le projet ${projectId}`);
    });

    // Gérer l’envoi de messages
    socket.on('sendMessage', async (data) => {
        const { sender, projectId, content } = data;

        // Enregistrer le message dans MongoDB
        const message = new Message({ sender, projectId, content });
        await message.save();

        // Envoyer le message aux utilisateurs de la salle
        io.to(projectId).emit('receiveMessage', message);

        // Envoyer une notification via RabbitMQ
        if (rabbitChannel) {
            rabbitChannel.sendToQueue("notifications", Buffer.from(JSON.stringify({
                type: "new_message",
                projectId,
                sender,
                content
            })));
        }
    });

    // Déconnexion de l’utilisateur
    socket.on('disconnect', () => {
        console.log(`🔴 Utilisateur déconnecté : ${socket.id}`);
    });
});

// 🔹 Récupérer les messages d'un projet
app.get('/messages/:projectId', async (req, res) => {
    try {
        const messages = await Message.find({ projectId: req.params.projectId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log(`🚀 Serveur de collaboration sur http://localhost:${PORT}`);
});
