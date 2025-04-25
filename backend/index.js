import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB  from './config/db.js';
import userRouter from './routes/userRoutes.js';
import bookrouter from './routes/bookRoutes.js';
// import GroupRoutes from './routes/GroupRoutes.js';
// import MessageRoute from './routes/MessageRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initSocket } from './socket.js'; // 👈 import socket init function

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/users', userRouter);
app.use('/books', bookrouter);
// app.use('/groups', GroupRoutes);
// app.use('/messages', MessageRoute);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/build', 'index.html'));
  });
}


initSocket(server, corsOptions); 


app.use(notFound);
app.use(errorHandler);


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
