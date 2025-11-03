import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';
import ProductRoute from './routes/product.route';
import ReviewRoute from './routes/review.route';
import AddressRoute from './routes/address.route';
import CartRoute from './routes/cart.route';
import OrderRoute from './routes/order.route';

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
import { initializeSocket } from './config/socket';
import path from 'path';
// import { setupSwagger } from './config/swagger';
import ejs from 'ejs';


const app = express();
const server = http.createServer(app);
initializeSocket(server);
app.use(cookieParser());


const port = process.env.PORT as string || 8080;

connectDb();
app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.json());
app.use(cors());
app.use(requestLogger)

//===========SWAGGER===========
// setupSwagger(app);

//===========SECURITY MIDDLEWARE===========
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://iampesmobile.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", 'https://iampesmobile.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    },
  })
); // Set security HTTP headers
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
app.use('/api/v1/review', ReviewRoute);
app.use('/api/v1/address', AddressRoute);
app.use('/api/v1/cart', CartRoute);
app.use('/api/v1/order', OrderRoute);

app.get("/test-reset", async (req, res) => {
  res.render("reset-success", { 
    logoUrl: "https://iampesmobile.com/uploads/techhouse.png",
    requestId: "ABC123",
    fullName: "Nguyen Hoang Kien",
    userEmail: "kien@techhouse.vn",
    tempPassword: "https://techhouse.vn/reset?token=xyz",
    loginUrl: "fedeade",
    time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    year: new Date().getFullYear(),
    supportUrl: "https://techhouse.vn/support",
    policyUrl: "https://techhouse.vn/privacy",
  });
});


app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

export default app;
