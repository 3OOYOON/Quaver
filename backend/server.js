const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const conn = require('./queries');
const upload = require('./file-upload');
const { json } = require('body-parser');

const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: `http://localhost:3000`,
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use(express.static('shared'));


app.post('/makePost', upload.array('imageFiles'), async (req, res)=>{
    const datePosted = Date.now()
    let origPostData = req.body;

    if (origPostData['tags']) {
        origPostData['tags'] = JSON.parse(origPostData['tags']);
    }
    else {
        origPostData['tags'] = [];
    }
    
    let imagesAsList = []
    origPostData['datePosted'] = datePosted;
    if (req.files && req.files.length > 0) {
        imagesAsList = req.files.map(file => `/uploads/images/${file.filename}`)
    }
    origPostData['images'] = imagesAsList.join(',');
    let newPostData = await conn.makePost(origPostData)
    newPostData['images'] = imagesAsList
    res.json(newPostData)
})

app.get('/loadPosts', async (req, res)=>{
    const response = await conn.getPosts(null, [], []);
    res.json(response);
})

app.get('/loadSomePosts/:postsToSkip', async (req, res)=>{
    const postsToSkip = req.params.postsToSkip.split(',')
    const response = await conn.getPosts(null, postsToSkip, []);
    res.json(response);
})

app.get('/loadTagPosts/:tags', async (req, res)=>{
    let tags = req.params.tags.split(',')
    if (tags == ['none']) {
        tags = []
    } 
    const response = await conn.getPosts(null, [], tags);
    res.json(response);
})

app.get('/loadReplies/:parentID', async (req, res)=>{
    parentID = req.params.parentID
    const response = await conn.getPosts(parentID, [], []);
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