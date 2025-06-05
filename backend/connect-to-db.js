import dotenv from "dotenv";
import * as fs from "fs";
import { createConnection } from "mysql2/promise";
import { arrayBuffer } from "stream/consumers";
import { randomInt } from "crypto";
// const bcrypt = require('bcrypt');


dotenv.config();

async function connectToDB() {
    try {
        const options = {
            host: process.env.TIDB_HOST,
            port: process.env.TIDB_PORT,
            user: process.env.TIDB_USER,
            password: process.env.TIDB_PASSWORD,
            database: process.env.TIDB_DATABASE,
            ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {
                minVersion: 'TLSv1.2',
                ca: process.env.TIDB_CA_PATH ? fs.readFileSync(process.env.TIDB_CA_PATH) : undefined
            } : null,
        }
        return await createConnection(options);
    } catch (err) {
        throw new Error(`Failed to connect to TiDB cluster: ${err.message}`);
    }
}


export async function getPosts() {
    let conn = await connectToDB();
    let [rows] = await conn.query(`
        SELECT posts.*, GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ',') AS tags
        FROM posts
        LEFT JOIN postsToTags ON posts.postID = postsToTags.postID
        GROUP BY posts.postID
        ORDER BY datePosted DESC LIMIT 10;`
    );
    for (let i=0; i<rows.length; i++) {
        if (rows[i].tags) {
            rows[i].tags = rows[i].tags.split(",");
        }
        else {
            rows[i].tags = []
        }
    }
    return rows;
}

export async function checkDuplicates(user, email){
    let conn = await connectToDB();
   
    //list of username duplicates
    const [users] = await conn.query(
        'SELECT * FROM users WHERE username = ?', [user]
    );
    //list of email duplicates
    const [emails] = await conn.query(
        'SELECT * FROM users WHERE email = ?', [email]
    );

    //return length of each. both should be empty (false) with no duplicates
    const dupCheck = [users.length, emails.length];
    return dupCheck;
}


export async function makePost(postData) {
    let conn = await connectToDB();

    const [result] = await conn.query(
        `INSERT INTO posts (title, content, datePosted) VALUES (?, ?, ?);`, 
        [postData['title'], postData['content'], postData['datePosted']]
    )
    const lastInsertedId = result.insertId;

    postData.tags.forEach(tag => {
        conn.query(
            `INSERT INTO postsToTags (postID, tag) VALUES (?, ?);`, 
            [lastInsertedId, tag]
        )
    });
}
    

export async function auth(email, pword){
    let conn = await connectToDB();
   
    //pulls account based on email and tries to check pword entered
    const [account] = await conn.query(
        'SELECT pword FROM users WHERE email = ?', [email]
    );

    //if no account returned, can't check pword, both checks false
    if (account.length != 1){
        const negRes = [0, 0]
        return negRes
    } 

    const res = [1, (account[0].pword == pword)]

    return res;
}

export async function signUp(user, email, pword){
    let conn = await connectToDB();
    const [rows] = await conn.query(
        'INSERT INTO users (username, email, pword) VALUES (?, ?, ?)', [user, email, pword]
    );

    return true;
}