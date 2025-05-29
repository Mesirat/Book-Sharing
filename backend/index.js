import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import bookrouter from './routes/bookRoutes.js';
import groupRouter from './routes/groupRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initSocket } from './socket.js';
// import recommendationRouter from "./routes/recommendationRoutes.js"






dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173'
   
  ],
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
};



const io = initSocket(server, corsOptions);
app.set("io", io);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use('/users', userRouter);
app.use('/books', bookrouter);
app.use('/groups', groupRouter);
app.use('/messages', messageRouter);

// app.use("/recommendation", recommendationRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

app.use(errorHandler);
app.use(notFound);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
