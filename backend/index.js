import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoutes.js'
dotenv.config();
const app = express();
const port = process.env.PORT|| 3000
app.use(express.json());
app.use(cookieParser())
app.use('/user',userRoute)


connectDB();
app.use(notFound)
app.use(errorHandler)
app.listen (port,()=>{
    console.log(`App is running to port:${port}`)
})
