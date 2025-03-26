const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express()

app.use(express.json());
app.use(cors());
require('dotenv').config();
const port = process.env.PORT | 3003
const host = "localhost"

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const ProjectRoute = require('./Router/Project'); 
app.use("/projects",ProjectRoute) 

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
