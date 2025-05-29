import dotenv from "dotenv";
import * as fs from "fs";
import { createConnection } from "mysql2/promise";


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
    const [rows] = await conn.query(
        'SELECT * FROM posts, postsToTags WHERE posts.postID = postToTags.postID;'
    );
    return rows;
}