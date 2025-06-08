const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const conn = require('./queries');
const upload = require('./file-upload');

const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));


app.post('/makePost', upload.array('imageFiles'), async (req, res)=>{
    let postData = req.body;
    console.log(postData)
    postData.images = ""
    if (req.files) {
        postData.images = req.files.map(file => `/uploads/images/${file.filename}`).join(',');
    }
    const response = await conn.makePost(postData);
    res.json(response)
})

app.get('/loadPosts', async (req, res)=>{
    const response = await conn.getPosts(null);
    res.json(response);
})

app.get('/loadReplies/:parentID', async (req, res)=>{
    parentID = req.params.parentID
    const response = await conn.getPosts(parentID);
    res.json(response);
})

app.get('/dupCheck/:user/:email', async (req, res)=>{
    //checks for duplicate usernames and emails in db
    let user = req.params.user
    let email = req.params.email
    const response = await conn.checkDuplicates(user, email);
    res.json(response);
})

app.get('/logIn/:email/:pword', async (req, res)=>{
    //checks for duplicate usernames and emails in db
    let pword = req.params.pword
    let email = req.params.email
    const response = await conn.auth(email, pword);
    res.json(response);
})

app.post('/signUp/:user/:email/:pword', async (req, res)=>{
    let user = req.params.user
    let email = req.params.email
    let pword = req.params.pword
    const response = await conn.signUp(user,email,pword);
    res.json(response)
})

app.listen(8000, (error) =>{
    if(!error)
        console.log(`Backend server running at http://localhost:8000`)
    else 
        console.log("Error occurred, server can't start: ", error);
    }
);