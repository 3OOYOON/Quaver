const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const connection = require('./connect-to-db')

const HOST_SITE = 'http://localhost'
const FRONTEND_PORT = 3000
const SERVER_PORT = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: `${HOST_SITE}:${FRONTEND_PORT}`,
    methods: ['GET', 'POST'],
    credentials: true
}));


app.post('/makePost', async (req, res)=>{
    const postData = req.body;
    const response = await connection.makePost(postData);
    res.send("Added post.")
})

app.get('/loadPosts', async (req, res)=>{
    const response = await connection.getPosts();
    res.json(response);
})

app.get('/dupCheck/:user/:email', async (req, res)=>{
    //checks for duplicate usernames and emails in db
    let user = req.params.user
    let email = req.params.email
    const response = await connection.checkDuplicates(user, email);
    res.json(response);
})

app.listen(SERVER_PORT, (error) =>{
    if(!error)
        console.log(`Backend server running at ${HOST_SITE}:${SERVER_PORT}`)
    else 
        console.log("Error occurred, server can't start: ", error);
    }
);