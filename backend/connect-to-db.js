import dotenv from "dotenv";
import * as fs from "fs";
import { createConnection } from "mysql2/promise";


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
            host: process.env.TIDB_HOST || '127.0.0.1',
            port: process.env.TIDB_PORT || 4000,
            user: process.env.TIDB_USER || 'root',
            password: process.env.TIDB_PASSWORD || '',
            database: process.env.TIDB_DATABASE || 'test',
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
    let conn = await process.env.DATABASE_URL ? await connectWithURL() : await connectWithOptions();
    const [rows] = await conn.query(
        'SELECT * FROM posts;'
    );
    return rows;
}