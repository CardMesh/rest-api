import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import Ddos from 'ddos';
import connection from './database/connection.js';
import auth from './routes/auth.js';
import theme from './routes/themes.js';
import users from './routes/users.js';
import { notFound } from './middleware/error.js';
import { corsOptions } from './config/cors-config.js';
import { ddosConfig } from './config/ddos-config.js';
import { jsonOptions, urlEncodedOptions } from './config/express-config.js';

dotenv.config();
connection();

const app = express();
const ddos = new Ddos(ddosConfig);



app.use('/uploads', express.static('uploads'));
app.use(fileUpload());
app.use(ddos.express);
app.use(cors(corsOptions));
app.use(compression());
app.use(helmet());
app.use(express.urlencoded(urlEncodedOptions));
app.use(express.json(jsonOptions));
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/themes', theme);
app.use(notFound);

app.listen(+process.env.PORT);
