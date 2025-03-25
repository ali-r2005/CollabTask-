require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reportsRoutes = require('./Router/Reports');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/reports', reportsRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Reports Service running on http://localhost:${PORT}`);
});