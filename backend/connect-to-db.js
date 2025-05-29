import dotenv from "dotenv";
import * as fs from "fs";
import { createConnection } from "mysql2/promise";
import { arrayBuffer } from "stream/consumers";


/**
 * Database connection.
 * @typedef {import("mysql2/promise").Connection} Connection
 */

/**
 * Player.
 * @typedef {Object} Player
 * @property {number} id Player ID.
 * @property {number} coins Coins.
 * @property {number} goods Goods.
 */

// Step 2. Load environment variables from .env file via the 'dotenv' package.
dotenv.config();

/**
 * 🔌 Step 3 (Option 1). Establish a connection to TiDB cluster with connection URL.
 *
 * @returns {Promise<Connection>}
 */
async function connectWithURL() {
    try {
        const url = process.env.DATABASE_URL || 'mysql://root@localhost:4000/test';
        return await mysql2.createConnection(url);
    } catch (err) {
        throw new Error(`Failed to connect to TiDB cluster: ${err.message}`);
    }
}

/**
 * 🔌 Step 3 (Option 2). Establish a connection to TiDB cluster with connection options.
 *
 * @returns {Promise<Connection>}
 */
async function connectWithOptions() {
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

/**
 * Get TiDB version.
 *
 * @param conn {Connection}
 * @returns {Promise<string>}
 */
async function getTiDBVersion(conn) {
    const [rows] = await conn.query('SELECT VERSION() AS tidb_version;');
    return rows[0]['tidb_version'];
}


export async function getPosts() {
    let conn = await process.env.DATABASE_URL ? await connectWithURL(): await connectWithOptions();
    const [rows] = await conn.query(
        'SELECT * FROM posts;'
    );
    return rows;
}

export async function checkDuplicates(user, email){
    let conn = await process.env.DATABASE_URL ? await connectWithURL(): await connectWithOptions();
   
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