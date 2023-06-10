import dotenv from 'dotenv';
import connection from './src/data/connection.js';
import app from './app.js';

dotenv.config();
connection(process.env.DB_CONNECTION);

app.listen(+process.env.PORT);
