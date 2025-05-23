const express = require('express');
const cors = require('cors');
const connection = require('./connect-to-db')

const app = express();
const HOST_SITE = 'http://localhost'
const FRONTEND_PORT = 3000
const SERVER_PORT = 8000;


app.use(cors({
    origin: `${HOST_SITE}:${FRONTEND_PORT}`,
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

app.post('/', (req, res)=>{
    const {name} = req.body;
    connection.connectToDB();
    res.send(JSON.stringify(`Welcome ${name}`));
})

app.get('/posts', async (req, res)=>{
    const response = await connection.getPosts();
    res.json(response);
})

app.listen(SERVER_PORT, (error) =>{
    if(!error)
        console.log(`Backend server running at ${HOST_SITE}:${SERVER_PORT}`)
    else 
        console.log("Error occurred, server can't start: ", error);
    }
);