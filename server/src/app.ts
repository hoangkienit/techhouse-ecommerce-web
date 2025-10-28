import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';
import ProductRoute from './routes/product.route';
import ReviewRoute from './routes/review.route';
import AddressRoute from './routes/address.route';
import CartRoute from './routes/cart.route';
import DiscountRoute from './routes/discount.route';
import OrderRoute from './routes/order.route';

import cors from 'cors';
import errorHandler from './middlewares/error.middleware';
const cookieParser = require("cookie-parser");

const app = express();
// const server = http.createServer(app);
app.use(cookieParser());

app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from TypeScript backend!');
});

app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/product', ProductRoute);
app.use('/api/v1/review', ReviewRoute);
app.use('/api/v1/address', AddressRoute);
app.use('/api/v1/cart', CartRoute);
app.use('/api/v1/discount', DiscountRoute);
app.use('/api/v1/order', OrderRoute);

app.use(errorHandler);

export default app;
