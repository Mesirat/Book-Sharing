import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async()=>{
   await mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('Connected to mongoDB')
    })
    .catch((err)=>{
        console.error('Failed to connect to MongoDB:',err.message);
    })
}
export default connectDB;