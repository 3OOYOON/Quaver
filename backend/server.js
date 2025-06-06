const express = require('express');
// const bodyParser = require('body-parser')
const cors = require('cors');
const connection = require('./utils')

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST'],
    credentials: true
}))


app.post('/makePost', async (req, res)=>{
    const postData = req.body;
    const response = await connection.makePost(postData);
    res.json(response)
})

app.get('/loadPosts', async (req, res)=>{
    const response = await connection.getPosts(null);
    res.json(response);
})

app.get('/loadReplies/:parentID', async (req, res)=>{
    parentID = req.params.parentID
    const response = await connection.getPosts(parentID);
    res.json(response);
})

app.get('/dupCheck/:user/:email', async (req, res)=>{
    //checks for duplicate usernames and emails in db
    let user = req.params.user
    let email = req.params.email
    const response = await connection.checkDuplicates(user, email);
    res.json(response);
})

app.get('/logIn/:email/:pword', async (req, res)=>{
    //checks for duplicate usernames and emails in db
    let pword = req.params.pword
    let email = req.params.email
    const response = await connection.auth(email, pword);
    res.json(response);
})

app.post('/signUp/:user/:email/:pword', async (req, res)=>{
    let user = req.params.user
    let email = req.params.email
    let pword = req.params.pword
    const response = await connection.signUp(user,email,pword);
    res.json(response)
})

app.listen(8000, (error) =>{
    if(!error)
        console.log(`Backend server running at http://localhost:8000`)
    else 
        console.log("Error occurred, server can't start: ", error);
    }
);