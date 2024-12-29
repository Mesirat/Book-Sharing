import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
dotenv.config();
const app = express();
const port = process.env.PORT|| 3000
app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use('/users',userRoutes)


connectDB();
app.use(notFound)
app.use(errorHandler)
app.listen (port,()=>{
    console.log(`App is running to port:${port}`)
})
