import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT
app.listen (port,()=>{
    console.log(`App is running to port:${port}`)
})
