import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import health from './src/routes/health.route.js';
import auth from './src/routes/auth.route.js';
import theme from './src/routes/theme.route.js';
import users from './src/routes/user.route.js';
import { notFound } from './src/middlewares/error.middleware.js';
import { corsOptions } from './src/configs/cors.config.js';
import { jsonOptions, urlEncodedOptions } from './src/configs/express.config.js';
import { limiterOptions } from './src/configs/limiter.config.js';

const app = express();

app.use(fileUpload());
app.use(cors(corsOptions));
app.use(compression());
app.use(helmet());
app.use(express.urlencoded(urlEncodedOptions));
app.use(express.json(jsonOptions));
app.use(rateLimit(limiterOptions));
app.use('/api/health', health);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/themes', theme);
app.use(notFound);

export default app;
