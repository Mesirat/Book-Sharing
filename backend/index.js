import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/user',user_route)
const port = process.env.PORT|| 3000

connectDB();

app.listen (port,()=>{
    console.log(`App is running to port:${port}`)
})
