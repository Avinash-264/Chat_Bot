const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({path : '../.env'});

const app = express();

app.use(express.json());
app.use(cors());

const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.BACKEND_PORT || 8000;
console.log(process.env.GEMINI_API_KEY)
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
