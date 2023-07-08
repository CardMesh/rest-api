import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import health from './src/routes/health.route.js';
import auth from './src/routes/auth.route.js';
import theme from './src/routes/theme.route.js';
import users from './src/routes/user.route.js';
import { notFound } from './src/middlewares/error.middleware.js';
import { corsOptions } from './src/configs/cors.config.js';
import { jsonOptions, urlEncodedOptions } from './src/configs/express.config.js';
import { limiterOptions } from './src/configs/limiter.config.js';
import { apiOptions } from './src/configs/api.config.js';
import { fileUploadOptions } from './src/configs/fileupload.config.js';
import { compressionOptions } from './src/configs/compression.config.js';
import { helmetOptions } from './src/configs/helmet.config.js';

const app = express();

app.use(cors(corsOptions));
app.use(compression(compressionOptions));
app.use(helmet(helmetOptions));
app.use(fileUpload(fileUploadOptions));
app.use(express.urlencoded(urlEncodedOptions));
app.use(express.json(jsonOptions));
app.use(rateLimit(limiterOptions));
app.use(`${apiOptions.prefix}/health`, health);
app.use(`${apiOptions.prefix}/auth`, auth);
app.use(`${apiOptions.prefix}/users`, users);
app.use(`${apiOptions.prefix}/themes`, theme);
app.use(notFound);

export default app;
