import dotenv from "dotenv";
import * as fs from "fs";
import { arrayBuffer } from "stream/consumers";
import * as mysql from "mysql2/promise"

dotenv.config();

const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {
                minVersion: 'TLSv1.2',
                ca: process.env.TIDB_CA_PATH ? fs.readFileSync(process.env.TIDB_CA_PATH) : undefined
            } : null,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function getPosts(parentID) {
    let parentRequirement = "IS NULL"
    if (parentID) {
        parentRequirement = "= "+parentID;
    }
    let [rows] = await pool.query(`
        SELECT p.*, GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ',') AS tags , (
            SELECT COUNT(*)
            FROM posts
            WHERE posts.parentID = p.postID
        ) AS numReplies
        FROM posts p
            LEFT JOIN postsToTags ON p.postID=postsToTags.postID
            WHERE p.parentID ${parentRequirement}
            GROUP BY p.postID
            ORDER BY p.datePosted DESC LIMIT 10;
        `);
    for (let i=0; i<rows.length; i++) {
        if (rows[i].tags) {
            rows[i].tags = rows[i].tags.split(",");
        }
        else {
            rows[i].tags = [];
        }
    }
    return rows;
}

export async function checkDuplicates(user, email){
    //list of username duplicates
    const [users] = await pool.query(
        'SELECT * FROM users WHERE username = ?', [user]
    );
    //list of email duplicates
    const [emails] = await pool.query(
        'SELECT * FROM users WHERE email = ?', [email]
    );

    //return length of each. both should be empty (false) with no duplicates
    const dupCheck = [users.length, emails.length];
    return dupCheck;
}


export async function makePost(postData) {
    const datePosted = Date.now()

    const [result] = await pool.query(
        `INSERT INTO posts (parentID, posterID, title, content, datePosted) VALUES (?, ?, ?, ?, ?);`, 
        [postData['parentID'], postData['posterID'], postData['title'], postData['content'], datePosted]
    )
    const postId = result.insertId;

    if (postData.tags) {
        postData.tags.forEach(tag => {
        pool.query(
            `INSERT INTO postsToTags (postID, tag) VALUES (?, ?);`, 
            [postId, tag]
        )
    });
    }
    return [postId, datePosted];
}
    

export async function auth(email, pword){
    //pulls account based on email and tries to check pword entered
    const [account] = await pool.query(
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
    const [rows] = await pool.query(
        'INSERT INTO users (username, email, pword) VALUES (?, ?, ?)', [user, email, pword]
    );

    return true;
}