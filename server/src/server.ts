import express from 'express';
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
import requestLogger from './middlewares/request.middleware';
import xssClean = require('xss-clean');
import hpp from 'hpp';


const app = express();
// const server = http.createServer(app);
app.use(cookieParser());

const port = process.env.PORT as string || 8080;

connectDb();
app.use(express.json());
app.use(cors());
app.use(requestLogger)

//===========SECURITY MIDDLEWARE===========
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize data against NoSQL injection
app.use(xssClean()); // Sanitize data against XSS attacks
app.use(hpp()); // Protect against HTTP Parameter Pollution

// Routes
app.get('/', (req, res) => {
  res.send('Hello word!');
});
app.get("/health", (req, res) => res.send("OK"));
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/product', ProductRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

export default app;
