import dotenv from 'dotenv';
import connection from './src/data/connection.data.js';
import app from './app.js';

dotenv.config();
await connection(process.env.DB_CONNECTION);

app.listen(+process.env.PORT);
