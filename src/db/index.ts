import { Pool } from 'pg';
import { config } from '../config/index.js';

const pool = new Pool(config.postgres);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export const getClient = () => pool.connect();