import dotenv from "dotenv";
import * as fs from "fs";
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

export async function getPosts(parentID, postsToSkip, tags) {
    let parentRequirement = "IS NULL"
    if (parentID) {
        parentRequirement = "= "+parentID;
    }
    let idRequirement = ''
    if (postsToSkip.length != 0) {
        idRequirement = 'AND posts.postID NOT IN (?)'
    }
    const query = `
        SELECT posts.*, GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ',') AS tags
        FROM posts
        LEFT JOIN postsToTags ON posts.postID=postsToTags.postID
        WHERE posts.parentID ${parentRequirement}
        ${idRequirement}
        GROUP BY posts.postID
        ORDER BY posts.datePosted DESC LIMIT 20;
        `
    let rows;
    if (postsToSkip.length != 0) {
        [rows] = await pool.query(query, [postsToSkip])
    }
    else {
        [rows] = await pool.query(query)
    }

    for (let i=0; i<rows.length; i++) {
        if (rows[i].tags) {
            rows[i].tags = rows[i].tags.split(",");
        }
        else {
            rows[i].tags = [];
        }
        if (rows[i].images) {
            rows[i].images = rows[i].images.split(",");
        }
        else {
            rows[i].images = [];
        }
    }
    return rows;
}


export async function makePost(postData) {
    const [result] = await pool.query(
        `INSERT INTO posts (parentID, posterID, title, content, datePosted, images) VALUES (?, ?, ?, ?, ?, ?);`, 
        [postData['parentID'], postData['posterID'], postData['title'], postData['content'], postData['datePosted'], postData['images']]
    )
    const postID = result.insertId;

    postData.tags.forEach(tag => {
        pool.query(
            `INSERT INTO postsToTags (postID, tag) VALUES (?, ?);`, 
            [postID, tag]
        )
    })
    postData['postID'] = postID
    return postData;
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