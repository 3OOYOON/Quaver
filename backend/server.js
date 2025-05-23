const express = require('express');
const cors = require('cors');
const app = express();
const HOST_SITE = 'http://localhost'
const FRONTEND_PORT = 3000
const BACKEND_PORT = 8000;

app.use(cors({
    origin: `${HOST_SITE}:${FRONTEND_PORT}`,
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

app.get('/api/data', (req, res) => {
    res.json({ message: '👋 Hello from your backend!' });
});


app.listen(BACKEND_PORT, () => console.log(`Backend running at ${HOST_SITE}:${BACKEND_PORT}`));