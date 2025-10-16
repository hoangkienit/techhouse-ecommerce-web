import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';
import ProductRoute from './routes/product.route';

import connectDb from './config/mongo';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from "http";
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import errorHandler from './middlewares/error.middleware';
const cookieParser = require("cookie-parser");

const app = express();
// const server = http.createServer(app);
app.use(cookieParser());

const port = process.env.PORT as string || 8080;

app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from TypeScript backend!');
});

app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/product', ProductRoute);

app.use(errorHandler);

export default app;
