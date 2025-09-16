import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware để parse JSON
app.use(express.json());

// Route cơ bản
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

// Khởi chạy server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
