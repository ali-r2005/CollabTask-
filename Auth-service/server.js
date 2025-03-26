require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());



mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB :", err));

app.use('/auth', require('./Router/authRoutes')); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur d'authentification démarré sur http://localhost:${PORT}`);
});
