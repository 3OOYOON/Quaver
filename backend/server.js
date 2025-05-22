const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

app.get('/api/data', (req, res) => {
    res.json({ message: '👋 Hello from your backend!' });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));