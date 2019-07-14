import pg from 'pg';
import config from 'config';

const connectionString = config.get('db');
const pool = new pg.Pool({ connectionString });

export default pool;
