const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./Router/Task');

const app = express();
app.use(express.json());

require('dotenv').config();
const port = process.env.PORT | 3005

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/tasks', taskRoutes);

app.listen(port, () => 
    console.log(`Server running at http://localhost:${port}`)
);